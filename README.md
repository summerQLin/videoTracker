# Authorization Service

### Design

The service is role-based access control for Docker container images, following the design of DTR

* Account has his own namespace.
* In order to assign group's accessibility to repositories, organization should be first created, by default an org has an owner team, admin accounts will be added to owner team, then they will be able to add other teams and team members and grant team permissions on repositories.

### Mongo DB data model design

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
        "visibility" : "public",
        "status" : "ok"
} 
```

3. collection: teams, e.g.

```
{
        "_id" : ObjectId("568118d2b066cc58fdc1e32f"),
        "org_id" : ObjectId("5680e8b5b066cc58fdc1e329"),
        "type" : "ldap",
        "name" : "DockerHub",
        "description" : "",
        "ldapDN" : "cn=DockerHub,ou=Groups,o=hp.com",
        "ldapGroupMemberAttribute" : "member",
        "members" : [
                {
                        "member_id" : ObjectId("5680e77cb066cc58fdc1e328")
                }
        ]
}

```

4. collection: repository_user_access, e.g.

```
{
        "_id" : ObjectId("56813a76b066cc58fdc1e330"),
        "repository_id" : ObjectId("5680eaa4b066cc58fdc1e32a"),
        "userAccessList" : [
                {
                        "user_id" : ObjectId("5680e77cb066cc58fdc1e328"),
                        "access_level" : "admin"
                }
        ]
}
```

5. repository_team_access, e.g.

```
{
        "_id" : ObjectId("56813a85b066cc58fdc1e331"),
        "repository_id" : ObjectId("5680eaf7b066cc58fdc1e32b"),
        "teamAccessList" : [
                {
                        "team_id" : ObjectId("568118d2b066cc58fdc1e32f"),
                        "access_level" : "read-only"
                },
               {
                        "team_id" : ObjectId("5682209b4160bc293e5b23a8"),
                        "access_level" : "admin"
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

* get account's accessible repositories

  GET /authz?account=qing.lin@hpe.com

  ```
[
  {
    "_id": "5680eaf7b066cc58fdc1e32b",
    "namespace": "summerlin",
    "namespaceType": "organization",
    "name": "busybox",
    "shortDescription": "",
    "visibility": "private",
    "status": "ok",
    "repository_id": "5680eaf7b066cc58fdc1e32b",
    "access_level": "read-only"
  },
  {
    "_id": "5680eaa4b066cc58fdc1e32a",
    "namespace": "qinglin",
    "namespaceType": "user",
    "name": "busybox",
    "shortDescription": "",
    "visibility": "public",
    "status": "ok",
    "repository_id": "5680eaa4b066cc58fdc1e32a",
    "access_level": "admin"
  }
]
  ```