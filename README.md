# Authorization Service

### Design

The service is role-based access control for Docker container images, following the design of DTR

* Account has his own namespace.
* In order to assign group's accessibility to repositories, organization should be first created, by default an org has an owner team, admin accounts will be added to owner team, then they will be able to add other teams and team members and grant team permissions on repositories.

### Mongo DB Model schema and data example

1. collection: accounts, e.g.

    ```
    {
            "_id" : ObjectId("5680e77cb066cc58fdc1e328"),
            "type" : "user",
            "name" : "qinglin@hpe.com",
            "ldapLogin" : "uid=qing.lin@hpe.com,ou=People,o=hp.com",
            "isActive" : true
    }

    ```
2. collection: repositories, e.g.

    ```
    {
            "_id" : ObjectId("5680eaa4b066cc58fdc1e32a"), 
            "namespace" : "qinglin", 
            "namespaceType" : "user",
            "name" : "busybox",
            "shortDescription" : "",
            "longDescription":""
            "visibility" : "public",
            "status" : "ok"
    } 
    ```

3. collection: teams, e.g.

    ```
    {
            "_id" : ObjectId("568118d2b066cc58fdc1e32f"),
            "orgID" : ObjectId("5680e8b5b066cc58fdc1e329"),
            "type" : "ldap",
            "name" : "DockerHub",
            "description" : "",
            "ldapDN" : "cn=DockerHub,ou=Groups,o=hp.com",
            "ldapGroupMemberAttribute" : "member",
            "members" : [
                    {
                            "memberID" : ObjectId("5680e77cb066cc58fdc1e328")
                    }
            ]
    }

    ```

4. collection: repository_user_access, e.g.

    ```
    {
            "_id" : ObjectId("56813a76b066cc58fdc1e330"),
            "repositoryID" : ObjectId("5680eaa4b066cc58fdc1e32a"),
            "userAccessList" : [
                    {
                            "userID" : ObjectId("5680e77cb066cc58fdc1e328"),
                            "accessLevel" : "admin"
                    }
            ]
    }
    ```

5. repository_team_access, e.g.

    ```
    {
            "_id" : ObjectId("56813a85b066cc58fdc1e331"),
            "repositoryID" : ObjectId("5680eaf7b066cc58fdc1e32b"),
            "teamAccessList" : [
                    {
                            "teamID" : ObjectId("568118d2b066cc58fdc1e32f"),
                            "accessLevel" : "read-only"
                    },
                   {
                            "teamID" : ObjectId("5682209b4160bc293e5b23a8"),
                            "accessLevel" : "admin"
                    }

            ]
    }

    ```
### How to run 

```
npm install
npm start
```

### API

  * Deal with repositories

    GET /authz/repositories
    GET /authz/repositories/{namespace}
    GET /authz/repositories/{namespace}/{reponame}

    POST /authz/repositories/{namespace} -d {"name":"busybox", "shortDescription":"", "longDescription":"", "visibility":"public"}
    
    PUT DELETE...
   
  * Deal with accounts or organization

    GET /authz/accounts/{accountname}

    POST /authz/accounts -d {"type":"user", "name":"qing.lin@hpe.com", "ldapLogin":"uid=qing.lin@hpe.com,ou=People,o=hp.com"}

    POST /authz/accounts -d {"type":"organization", "name":"summerlin"}

    PUT DELETE...

    
  * Deal with teams

    GET /authz/accounts/{orgname}/teams/{teamname}

    GET /authz/accounts/{orgname}/teams/{teamname}/members

    Create a team in organization
    POST /authz/accounts/{orgname}/teams -d {"name":"DockerHub", "description": "", "type":"ldap", "ldapDN":"cn=DockerHub,ou=Groups,o=hp.com",  "ldapGroupMemberAttribute" : "member"}
    PUT DELETE...
 
    Add an user to team
    PUT /authz/{orgname}/teams/{teamname}/members/{member}
    DELETE...

  * Access control

    List all repositories granted access to user 
    GET /authz/accounts/{username}/repositoryAccess

    Check a user's access to a repository
    GET /authz/accounts/{username}/repositoryAccess/{namesapce}/{reponame}

    List repository access grants for a team
    GET /authz/accounts/{orgname}/teams/{teamname}/repositoryAccess

    





