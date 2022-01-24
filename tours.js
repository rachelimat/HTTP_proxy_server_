const { Console } = require('console');
const fs = require('fs');
const { use } = require('./routes');

// variables
const dataPath = './data/tours.json';

//-----------------------------------------------------------
// helper methods
//-----------------------------------------------------------
const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }

        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {

    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }

        callback();
    });
};

//-----------------------------------------------------------
// CRUD methods
//-----------------------------------------------------------
module.exports = {
    // ******* READ Tours ******* //
    getTours: function(req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            } 
            res.send(!data? JSON.parse("{}"): JSON.parse(data));

        });
    },

    getSites: function(req, res) {
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            } 
            res.send(!data? JSON.parse("{}"): JSON.parse(data));

        });
    },

    // ******* CREATE Tour ******* //
    addTour: function(req, res) {

        readFile(data => {
               
                //check if id already exist
                var values = Object.values(data);
                for (var i in values) {
                    if (values[i]['id'] == req.body.id) {
                        res.send("Tour already exists");
                        return;
                    }
                }
                // all right
                data[req.body.id] = req.body;

                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send('New Tour added');
                });
            },
            true);
    },

    // ******* CREATE Site ******* //
    addSiteToTourpath: function(req, res) {
        readFile(data => {
            const tourId = req.params["id"];
            if (!data[tourId])
                res.status(400).send('id is not exsit!');//return
            else
            {
                const index = req.params["index"];
                if(data[tourId]["sites"])
                {
                 
                        let i = 0;
                        let flagIsEx = false;
                        while(data[tourId]['sites'][i])
                        {
                            if(data[tourId]['sites'][i].name == "undefined")
                                break;
                            else{

                                if(data[tourId]['sites'][i].name == req.body.name)
                                {
                                    flagIsEx = true;
                                    break;

                                }
                                i++;
                            }
                           
                        }
                        if(flagIsEx == false)
                        {
                            //add in index
                            if(index > i + 1)//add to the end
                            {
                                data[userId]['sites'].splice(i + 1, 0, req.body) 
                                writeFile(JSON.stringify(data, null, 2), () => {
                                    res.status(200).send(`users id:${tourId} addSiteToTourpath in index:${i + 1}`);
                                });  
                            }
                            else//add at index
                                {
                                    data[tourId]['sites'].splice(index, 0, req.body)
                                    writeFile(JSON.stringify(data, null, 2), () => {
                                        res.status(200).send(`users id:${tourId} addSiteToTourpath in index:${index}`);
                                    });
                                }
                        }
                        else
                            res.status(200).send('site exsit!');//return


                    }
                else               
                    res.status(400).send('tourId not exsit!');//return

            }

           
        },
            true);
        res.status(200).send('new site added to the tour');
    },

    // ******* DELETE Tour ******* //
    deleteTour: function(req, res) {

        readFile(data => {

                const tourId = req.params['id'];
                // check if id exists
                var values = Object.values(data);
                var isExist = false;
                for (var i in values) {
                    if (values[i]['id'] == tourId) {
                        isExist = true;
                        break;
                    }
                }
                if (!isExist) {
                    res.status(400).send("Tour ID not found");
                    return;
                }
                // all right
                delete data[tourId];

                writeFile(JSON.stringify(data, null, 2), () => {
                    res.status(200).send(`tour id:${tourId} removed`);
                });
            },
            true);
    },

    getTour: function (req, res) {
        const tourId = req.params["id"];
        fs.readFile(dataPath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
            }
            else{
                data =  JSON.parse(data)
                res.send(!data? JSON.parse("{}") : data[tourId]);
            }
        });

    },

    AddCuponToTour: function (req, res) {
        readFile(data => {

            const tourId= req.params["id"];
            if (data[tourId])
            {

                if(data[tourId]['cupon'])
                {
                    data[tourId].cupon[req.body.code] = req.body;
                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send('new cupon added');
                    });
                            
                }
                else
                {
                    res.status(200).send('cupon filed does not exsit!');//must have this filed?
                    return;
                } 

            }
            else
                res.status(400).send('id does not exsit!');

        },
        true);
    },

    deleteCopunFromTour:function (req, res) {
        const tourId = req.params["id"];

        readFile(data => {
            
            const tourId = req.params["id"];

            if (data[tourId])
            {
                const code_c = req.params["code"];
                let flagEx = false ; 
                for (let i in data[tourId]['cupon'])
                {

                    if(data[tourId]['cupon'][i].code == code_c )
                    {
                        flagEx = true;
                        delete data[tourId]['cupon'][i];    
                        writeFile(JSON.stringify(data, null, 2), () => {
                            res.status(200).send(`cupon id:${code_c} removed`);
                        });
                        break;
                    }
                }
                
                if(flagEx == false)
                     {
                         res.status(400).send('cupon is not exsit!');
                         return;
                     }
            }
            else 
                {
                    res.status(400).send('id is not exsit!');
                    return;
                }
            },
        true);
    },

    updateTour: function (req, res) {
        
        readFile(data => {

            // add the new user
            const tourId = req.params["id"];
            if (data[tourId])
                {
                    data[tourId] = req.body;
                    writeFile(JSON.stringify(data, null, 2), () => {
                        res.status(200).send(`users id:${tourId} updated`);
                    });
                }
            else 
                res.status(400).send('id is not exsit!');
                
        },

        // const tourId = req.params['id'];
        //         // check if id exists
        //         var values = Object.values(data);
        //         var isExist = false;
        //         for (var i in values) {
        //             if (values[i]['id'] == tourId) {
        //                 isExist = true;
        //                 break;
        //             }
        //         }
        //         if (!isExist) {
        //             res.status(400).send("Tour ID not found");
        //             return;
        //         }
        //         // all right
        //         data[tourId].id = req.body.id;
        //         data[tourId].start_date =req.body.start_date;
        //         data[tourId].duration= req.body.duration;
        //         data[tourId].price= req.body.price;

        //         writeFile(JSON.stringify(data, null, 2), () => {
        //             res.status(200).send(`tour id:${tourId} updated`);
        //         });
        //     },
            true);
    },

};