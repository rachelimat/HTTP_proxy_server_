const express = require('express'),
    path = require('path'),
    toursRouts = require('./tours');

var router = express.Router();

router.get('/', (req, res) => {
    // empty path for the home page
    res.sendFile(path.join(__dirname + '/../html/index.html'));
});


router.get('/tours', toursRouts.getTours);
router.get('/tours/:id', toursRouts.getTour);

router.post('/tours', toursRouts.addTour);


router.post('/aS/:id/:index', toursRouts.addSiteToTourpath);
router.post('/aC/:id', toursRouts.AddCuponToTour);
router.delete('/tours/:id/cupon/:code', toursRouts.deleteCopunFromTour);

router.put('/tours/:id', toursRouts.updateTour);


router.delete('/tours/:id', toursRouts.deleteTour);


// str+="<table><tr><th class="+sort+">id</th><th  >start day</th><th  >duration</th><th>price</th><th>sites</th><th>cupons</th><th>update</th><th>delete</th><th></th></tr>"

module.exports = router;