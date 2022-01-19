# MY_Tour
RACHELI MATZLIACH
Ex3
Files:
C file :
server.c- servers the client .
threadpool.c- queue of tasks.
Readme - summery for this exercise plus instruction to run this exercise.
Input:
<port number><num of threads><num of tasks>
Output:
By client .
Run:
./server  + port + num of threads + num of tasks.
int mainProgram() - the program flow.
serveNewClients() - serve the client by listening to socket array .
handleRequest() – handles client request.
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

