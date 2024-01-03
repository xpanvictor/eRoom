# Socket architecture

The socket will be organized in a way to ensure most efficient chat structure.
The required communication slots are the following

1. Video Call Chat socket (namespace) - VCNamespaces
2. WebRTC required socket
   > Use a separate socket (rtcSocket)
3. Servers (chat) socket (namespace) - ServerNamespaces

Deliberations on CHAT namespaces (ServerNamespaces)
- Say each server uses a namespace, channels will be made with the namespace rooms.
With this, the personal (1v1) chat can use just one namespace - p1 namespace. 
- With the above, individual chat can be made using rooms?
  - Waste of resources, instead, the namespace can just address each member. 
  - Groups in the personal chat can then use rooms instead.


Considerations
- Implement a custom parser instead of validating later on.
- Integrate PM2 and admin UI.
- Implement a redis stream adapter for all namespaces
- Implement a mongodb adapter for ServerNamespaces
- Place the VCNamespaces into the rtcSocket

