# DB-Socket architecture

The DB is structured on several levels using a clustered MongoDB instance.
The collections are sub-grouped on the following sockets

1. User & Course
2. Chat

## User & Course
Ths namespaces are to be opened on the initiation of the server. However,
we can't run that on all the classes, this will kill the server. This is because a
namespace is structured as a course.

-> Can wake up course namespace when a user activates the namespace

