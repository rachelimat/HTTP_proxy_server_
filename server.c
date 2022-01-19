/////////////208179267
#include <netdb.h>
#include <stdlib.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <stdio.h>
#include <ctype.h>
#include <string.h>
#include <sys/stat.h>
#include <dirent.h>
#include <pthread.h>
#include <unistd.h>
#include "threadpool.h"
void closeSockets( int socketFd , int * arrSocketFd  , int numberOfRequest );

void errorInInput();
int checkIfNum(char * string);
char * CheckingPermissions(char *path,int sock);
int connectServerSocket(int argc ,char *argv[]);
int handleRequest(void * socket);
char * serverResponce(int  socketFd , char * path, struct stat fileStat );
void getLastModified(char *buf, char* path);
void getDate(char *buf);
char *getMimeType(char *name);
char * createFcase(char* path,int sock,int flag);
void creatResponse(int respone,int  socket,char  ContentType []);
void writeResponsToSocket(int socketFd,char * response,char * path);
void loadFile( char *path , int  socketFd );
void checkInput(int argc , char * argv[] );
int * serveNewClients(int argc , char *argv[] , int socketFd);
#define MAX_LENGTH 50
#define RFC1123FMT "%a, %d %b %Y %H:%M:%S GMT"

void errorInInput(){//error masage because of user input+
	

	printf("Usage: server <port> <pool-size> <max-number-of-request>\n");
	exit(1);
}
int checkIfNum(char * string){//check if the string is number
	

for(int x=0;x<strlen(string);x++){
    if(isdigit(string[x]!=1))
        return 0;
}
return 1;
}
int connectServerSocket(int argc ,char *argv[]){// create the main socket for client requests.
	

	struct sockaddr_in serv_addr ;
	int  numberOfRequest = atoi(argv[3] );
	int socketFd ; // main  file discrepter.
	
	socketFd = socket(AF_INET , SOCK_STREAM , 0);
	if (socketFd < 0){
		perror("Error opening socket");
		exit(1);
}
	serv_addr.sin_family = AF_INET ;
	serv_addr.sin_addr.s_addr = INADDR_ANY ;
	serv_addr.sin_port =htons(atoi(argv[1]));

	if (bind(socketFd , (struct sockaddr *)&serv_addr , sizeof(serv_addr)) < 0)
	{
		close(socketFd);
		perror("Error on binding");
		exit(1);
	}

	if( listen(socketFd , numberOfRequest) < 0 )	
	{
		close(socketFd);
		perror("ERORR on listening");
		exit(1);
	}
	
	return socketFd ;


}

int handleRequest(void * socket){

int socketFd =(*(int*)socket);
char buffer[4000],firstLCopy[4000];
int rc=0;//firstLLen=0;
char * firstLine,* path=NULL,*method=NULL,* protocol=NULL,*response=NULL,*token=NULL;
struct stat fileState;
const char s[2]=" ";

bzero(buffer,4000);
bzero(firstLCopy,4000);
rc=read((*(int*)socket),buffer,4000);
if(rc<0){
    printf("Eror :reading from socket\n");
    exit(1);
}

firstLine=strtok(buffer,"\r\n");

/////analyzing first line.

//strcpy(firstLCopy, firstLine);// get the path , method and protocol
token = strtok(firstLine, s);//get the first token

//now check the option of the 3 firsts  word 

if (token != NULL){//the first word is method
		method = (char*) malloc(sizeof(char)*strlen(token)+1);
		strcpy(method, token);
		
	}

token = strtok(NULL, s);//next word	
if (token != NULL) {//second word
		path = (char*) malloc(sizeof(char)*strlen(token)+3);
		sprintf(path, ".%s",token );
		
	}


token = strtok(NULL, s);//next word
if (token != NULL) {//third word
		protocol = (char*) malloc(sizeof(char)*strlen(token)+1);
		strcpy(protocol, token);
	}


token = strtok(NULL, s);	//check if there are more than 3 words
	if (token != NULL){	//there are more than 3 words
		//free all allocated
        free(method);
		free(path);
		free(protocol);
		
		creatResponse(400,socketFd,"text/html");//send error
        return 0;
	}
    //less than 3 words in the first read line
	if (method == NULL || path == NULL || protocol == NULL)
	{
		free(method);
		free(path);
		free(protocol);
		
		creatResponse(400,socketFd,"text/html");
		return 0;
	}
	if(strcmp(protocol,"HTTP/1.0") !=0   &&  strcmp(protocol,"HTTP/1.1") !=0 ){//check the version of protocol
		free(method);
		free(path);
		free(protocol);
		
		creatResponse(400,socketFd,"text/html");
		return 0;}

	if(strcmp(method,"GET") !=0  ){//the method is not GET
		free(method);
		free(path);
		free(protocol);
		
		creatResponse(501,socketFd,"text/html");
		return 0;
	}
	

response = serverResponce(socketFd ,path ,fileState);//return ready response to file


if(response == NULL )
	{	
		
		free(method);
		
		free(protocol);
		
        return 0;
	}
else{
writeResponsToSocket(socketFd,response,path);

free(method);

free(path);
free(protocol);
	
return 0;
}
}
//---------------------------------------------------------------------------------------------------------------------------
char * CheckingPermissions(char *path,int sock){
struct stat fStat;
int s=strlen(path)+1;
char tempp[s];
strcpy(tempp,path);
if(stat(path,&fStat)== -1){
		
		creatResponse(500,sock,path);//path or currCheck
		return NULL;
	}
if((S_ISDIR(fStat.st_mode))){
		tempp[strlen(tempp)-1]='\0';
		}

if ( !(S_IROTH & fStat.st_mode)){

	return NULL;

}

if(strcmp(path,"./")==0){
	return "good";
	}
char *temp=NULL,* currCheck=NULL,*copyPath;
currCheck=(char*)malloc(sizeof(char)*(strlen(path)+1));


copyPath=(char*)malloc(sizeof(char)*(strlen(path)+1));
if(currCheck==NULL || copyPath==NULL){
	
	free(currCheck);
	free(copyPath);
	creatResponse(500,sock,"text/html");//path or currCheck
		return NULL;
} 
strcpy(copyPath,path);

     


temp =strtok(copyPath,"/");//first word
strcpy(currCheck,temp);
strcat(currCheck,"/");
temp =strtok(NULL,"/");
strcat(currCheck,temp);



struct stat t;
while(temp != NULL ){

	if(stat(currCheck,&t)== -1){
		
		free(currCheck);
		free(copyPath);
		creatResponse(500,sock,path);//path or currCheck
		return NULL;
	}
	

	if(S_ISDIR(t.st_mode)){//it is a directory
	

		if(strcmp(tempp,currCheck)==0){
			
			free(currCheck);
			free(copyPath);
			return "good";
		}
			if ( !(S_IXOTH & t.st_mode)){

			free(currCheck);
			free(copyPath);
			
			return NULL ;
		}
		
}		
	else{
		
		if ( !(S_IROTH & t.st_mode)){
			free(currCheck);
			free(copyPath);
			
			return NULL ;
		}
		free(currCheck);
		free(copyPath);
		return "good";
	}
	
	temp =strtok(NULL,"/");//next word
	
	
	if(temp!=NULL){
		strcat(currCheck,"/");
		strcat(currCheck,temp);
	}
}


free(currCheck);
free(copyPath);
return "good";

}
//---------------------------------------------------------------------------------------------------------------------------
char * serverResponce(int  socketFd , char * path , struct stat fileStat ){



char * type = NULL ,*re=NULL,*per=NULL;

DIR *dir;
struct dirent* fileD=NULL;
	
if(stat(path,&fileStat)!=0){
	
creatResponse(404,socketFd,path);
	free(path);
return NULL;
}

	if(S_ISDIR(fileStat.st_mode)){
	
	int pathLen=strlen(path);
	if(path[pathLen-1]!=  '/'){
		
		creatResponse(302,socketFd,path);
		free(path);
		return NULL;
	}
	
	per =CheckingPermissions(path,socketFd );//check all the permissions of the path
	
	    if(per==NULL){
			
			creatResponse(403,socketFd,"text/html\0");
			free(path);
			return NULL;
		}
		dir=opendir(path);
		if(dir==NULL){
			
			creatResponse(500,socketFd,"text/html");//??
			closedir(dir);
			free(path);
			return NULL;
		}
		fileD=readdir(dir);//creat a pointer to dirent struct with all offolders
		while(fileD !=NULL){
			if(strcmp("index.html",fileD->d_name)==0){
				
				path=realloc(path,strlen(path)+strlen(fileD->d_name)+15);//20
				strcat(path,"index.html");
				
				re=createFcase( path, socketFd,0);//0 or 1?
				
				writeResponsToSocket(socketFd,re,path);
				free(path);
				closedir(dir);
				
				return NULL;
				
			}

		 fileD=readdir(dir);//next file

		}
		
		closedir(dir);//there is no file with "index.html"
		return createFcase( path,socketFd,1);// make from begining
		
		}
	//-----------------------------------------------------------------------------------//
	if(S_ISREG(fileStat.st_mode)){//the path is file
	
		type = getMimeType(path);
		if(type==NULL){
		 	creatResponse(404, socketFd,"text/html\0");//path not exist
			 free(path);
 			return NULL;	
		}
		per=CheckingPermissions(path,socketFd );//check all the permissions of the path
		
		if(per==NULL){
			
			creatResponse(403,socketFd,"text/html\0");
			free(path);
			return NULL;
		}
		else 
		return createFcase( path, socketFd, 0);
	

 	}
	 else{
		 	
			creatResponse(404, socketFd,"text/html\0");//path not exist
			free(path);
 			return NULL;


	 }
	 free(path);

return  NULL;
}
//---------------------------------------------------------------------------------------------------------------------------
char * createFcase(char* path,int sock,int flag){
	

char * response,date[MAX_LENGTH],lastModified[MAX_LENGTH], type[25]={0},size[10]={0};
time_t now ;
 getDate(date);
 getLastModified ( lastModified , path ) ;
struct stat st;


response=(char*)malloc(sizeof(char)*4000);
if(response==NULL){

	free(response);
	creatResponse(500,sock,"text/html\0");
	//exit(1);
	return NULL;
}

strcpy(response,"HTTP/1.1 200 OK\r\nServer: webserver/1.0\r\nDate: ");
strcat(response,date);
strcat(response,"\r\nContent-Type:");

if(getMimeType(path)!=NULL){
	strcpy(type,getMimeType(path));
	strcat(response,type);

}

stat(path,&st);

	if (flag ==0){
			strcat( response , "\r\nContent-Length: ");

	sprintf(size,"%ld",st.st_size);
	strcat( response , size );
	strcat( response , "\r\nLast-Modified: ");
	strcat( response , lastModified );
	strcat( response , "\r\nConnection: close\r\n\r\n");
		
		return response ;}

	else{
		
	char html[4000];
	bzero(html,4000);	
	DIR * dir=opendir(path);
	struct dirent* dentry=NULL;
	char tmp[25]={0},*copy,* buf;
	
	strcpy(html,"<HTML>\r\n<HEAD><TITLE>Index of");
	strcat(html,path);
	strcat(html,"</TITLE></HEAD>\r\n\r\n<BODY>\r\n<H4>Index of ");
	strcat(html,path);
	strcat(html,"</H4>\r\n\r\n<table CELLSPACING=8>\r\n<tr><th>Name</th><th>Last Modified</th><th>Size</th></tr>\r\n\r\n\r\n");
	
	while((dentry=readdir(dir))!=NULL){
		
		copy=calloc(strlen(path)+strlen(dentry->d_name)+3,sizeof(char));
		if(copy==NULL){
			
			creatResponse(500,sock,path);
			closedir(dir);
			return NULL;
		}
		strcpy(copy,path);
		strcat(copy,dentry->d_name);
		stat(copy,&st);
		if(stat(copy,&st)==-1){
		
			creatResponse(500,sock,copy);
			closedir(dir);
			return NULL;
		}
		strcat(html,"<tr>\r\n<td><A HREF=\"");
		strcat(html,dentry->d_name);
		if(S_ISDIR(st.st_mode)){
			strcat(html,"/\0");	
		}
		strcat(html,"\">");//
		strcat(html,dentry->d_name);
		if(S_ISDIR(st.st_mode)){
			strcat(html," \0");
		}
		strcat(html,"</A></td><td>");

		buf=calloc(128,sizeof(char));
		if(buf==NULL){
			free(buf);
			creatResponse(500,sock,copy);
			closedir(dir);
			return NULL;
		}

		now=st.st_mtime;
		strftime(buf,128,RFC1123FMT,gmtime(&now));
		
		strcat(html,buf);
		free(buf);
		
		strcat(html,"</td>\r\n<td>");

		if(!(S_ISDIR(st.st_mode))){

			sprintf(tmp,"%ld",st.st_size);
			strcat(html,tmp);
			
		}
		
		free(copy);
	}
	strcat( response , "\r\nContent-Length: ");

	sprintf(size,"%ld",strlen(html));
	strcat( response , size );
	strcat( response , "\r\nLast-Modified: ");
	strcat( response , lastModified );
	strcat( response , "\r\nConnection: close\r\n\r\n");
strcat(response,html);
strcat(response,"</td>\r\n</tr>\r\n\r\n");
strcat(response,"</table>\r\n\r\n<HR>\r\n\r\n");
strcat(response,"<ADDRESS>webserver/1.0</ADDRESS>");
strcat(response,"<BODY></HTML>\r\n");
closedir(dir);
return response;
	}
	
	return NULL;
}
//---------------------------------------------------------------------------------------------------------------------------
void getLastModified(char *buf, char* path){

	
	
	bzero(buf , MAX_LENGTH);
	struct stat st ;
	if (stat(path , &st) < 0 ){
		
		return ;
	}
		
    strftime (buf , MAX_LENGTH , RFC1123FMT , gmtime(&(st.st_mtime)));
	

}
void getDate(char *buf){
	
	time_t now ; 
	now = time (NULL);
	strftime(buf , MAX_LENGTH , RFC1123FMT , gmtime(&now)) ; 

}
//---------------------------------------------------------------------------------------------------------------------------
void closeSockets( int socketFd , int * arrSocketFd  , int numberOfRequest )// close all open sockets
{
	int i = 0 ; 
	
	for ( i = 0  ; i < numberOfRequest ; i++ )
		if(arrSocketFd[i] >= 0 )
			close(arrSocketFd[i]);
	close(socketFd);
}








char *getMimeType(char *name) {
	char *ext = strrchr(name, '.');
	if (!ext) return NULL;
	if (strcmp(ext, ".html") == 0 || strcmp(ext, ".htm") == 0) return "text/html";
	if (strcmp(ext, ".jpg") == 0 || strcmp(ext, ".jpeg") == 0) return "image/jpeg";
	if (strcmp(ext, ".gif") == 0) return "image/gif";
	if (strcmp(ext, ".png") == 0) return "image/png";
	if (strcmp(ext, ".css") == 0) return "text/css";
	if (strcmp(ext, ".au") == 0) return "audio/basic";
	if (strcmp(ext, ".wav") == 0) return "audio/wav";
	if (strcmp(ext, ".avi") == 0) return "video/x-msvideo";
	if (strcmp(ext, ".mpeg") == 0 || strcmp(ext, ".mpg") == 0) return "video/mpeg";
	if (strcmp(ext, ".mp3") == 0) return "audio/mpeg";
return NULL;
}
void writeResponsToSocket(int socketFd,char * response,char * path){//,char * path

int sumWhite=0,rc;
while(1){
    rc=write(socketFd,response,strlen(response));
    sumWhite+=rc;
    if(sumWhite==strlen(response)){
        
        break;
    }
	
	if(rc<0){
		
		free(response);
		creatResponse(500,socketFd,"text/html\0");
		
		
		return;
	}
}
	if(path !=NULL){
	
	
    loadFile( path , socketFd) ;
	}

	
	close( socketFd );
	
    free(response);
	
	return;
}
//---------------------------------------------------------------------------------------------------------------------------
void loadFile( char *path ,  int socketFd ){
   
       FILE * f;
     char buffer[1024]="";
     f = fopen (path, "r");
	int numBytes;
	int rc =0;
  
    //fseek (f, 0, SEEK_SET);
    while((numBytes = fread ( buffer ,1 ,1024 ,f)) > 0 ){
		
		rc = write(socketFd , buffer , numBytes) ;
        if(rc < 0 ){
           fclose(f);
			creatResponse(500,socketFd,NULL);
            return;
        }
    }
	
    fclose(f);
    // close(socketFd);
	
}

 
void checkInput(int argc , char * argv[] )

{

if(argc!=4){//check if thre ara 3 argument
    errorInInput();
}
for(int i=1;i<4;i++){
    if(!checkIfNum(argv[i]))
        errorInInput();
}
if(atoi(argv[1]) > 5000 || atoi(argv[1]) < 1024){//incorect port
		errorInInput() ;
	}
}
//---------------------------------------------------------------------------------------------------------------------------
void creatResponse(int respone,int  socket,char  ContentType []){


char  errorDetails[40],timeBuff[32]={0} ;
char *part2=(char*)malloc(sizeof(char)*220);
if(part2==NULL){
	
	free(part2);
	creatResponse(500,socket,NULL);
}
getDate(timeBuff);
time_t now ; 
now = time (NULL);
strftime(timeBuff , MAX_LENGTH , RFC1123FMT , gmtime(&now)) ; 
char  lengh [5]={0};

  char  typeResponse[40]; 
 
 switch (respone)
 { 
     case 302:{
		strcpy(typeResponse,"302 Found");
		strcpy(errorDetails,"Directories must end with a slash");
		strcpy(lengh,"123");
		break;}
    case 400:{
		strcpy(typeResponse,"400 Bad Request");
     	strcpy(errorDetails,"Bad Request");
		 strcpy(lengh,"113");
     	break;}
    case 403:{
		strcpy(typeResponse,"403 Found");
     	strcpy(errorDetails,"Access denied");
		 strcpy(lengh,"111");
    	 break;}
     case 404:{
		 
		strcpy(typeResponse,"404 Not Found");
     	strcpy(errorDetails,"File not found");
		 strcpy(lengh,"112");
     	break;}
     case 500:{
		
		strcpy(typeResponse,"500 Internal Server Error");
     	strcpy(errorDetails,"Some server side error");
		 strcpy(lengh,"144");
     	break;}
     case 501:{
		 strcpy(typeResponse,"501 Not supported");
		strcpy(errorDetails,"Method is not supported");
		strcpy(lengh,"129");
		break;}
 default:{ 
  		return ;
    	 }
 } 

                                            //set part 2
 
	strcpy(part2,"<HTML><HEAD><TITLE>");
	strcat(part2,typeResponse);
	strcat(part2,"</TITLE></HEAD>\r\n");
	strcat(part2,"<BODY><H4>");
	strcat(part2,typeResponse);
	strcat(part2,"</H4>\r\n");
	strcat(part2,errorDetails);
	strcat(part2,"\r\n<BODY></HTML/>\r\n");
	//strcat(part2,"\0");



char* readyerror = (char*)malloc((1000) * sizeof(char));
if(readyerror==NULL){
	free(readyerror);
	creatResponse(500,socket,NULL);
}

strcpy(readyerror, "HTTP/1.1 ");
strcat(readyerror, typeResponse);
strcat(readyerror, "\r\nServer: webserver/1.0\r\n");
strcat(readyerror, "Date: ");
strcat(readyerror, timeBuff);
strcat(readyerror, "\r\n");
if(respone== 302){
	strcat(readyerror, "Location: ");
	strcat(readyerror,ContentType);
	strcat(readyerror,"/\r\n");
	
}

strcat(readyerror, "Content-Type: ");
strcat(readyerror, "text/html");
strcat(readyerror, "\r\nContent-Length: ");
strcat(readyerror,lengh);

strcat(readyerror, "\r\nConnection: close\r\n\r\n");
strcat(readyerror, part2);

free(part2);

writeResponsToSocket( socket,readyerror,NULL);	


return; 
}
int * serveNewClients(int argc , char *argv[] , int socketFd){
  
    int numThreadsInPool = atoi(argv[2] );
    int  numberOfRequest = atoi( argv[3] );
	int i = 0 ;
	int  * arrSocketFd  = NULL ; // array of socket file discrepter.
	 threadpool * threadPool = NULL ;
	arrSocketFd=(int*)malloc((numberOfRequest)*sizeof(int));
    if(arrSocketFd==NULL){
        close(socketFd);
        perror("Error in malloc");
        exit(1);
    }
    threadPool=create_threadpool(numThreadsInPool);
    for(i=0;i<numberOfRequest;i++){
        arrSocketFd[i]=accept(socketFd,NULL,NULL);
        if(arrSocketFd[i]<0){
            destroy_threadpool(threadPool);
			closeSockets(socketFd,arrSocketFd,numberOfRequest);
            free(arrSocketFd);
            perror("Error in accept");
            exit(1);
        }
        dispatch(threadPool,handleRequest,&arrSocketFd[i]);
		

    }
destroy_threadpool(threadPool);
//close(socketFd);
//free(arrSocketFd);
return arrSocketFd;
}
int main(int argc , char *argv[])
{
	
	int socketFd ;
	int  * arrSocketFd ;
	checkInput(argc , argv);
	socketFd = connectServerSocket(argc ,argv);
	arrSocketFd = serveNewClients(argc , argv , socketFd) ;

	free(arrSocketFd);
	return 0 ; 
}

