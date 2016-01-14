build: Dockerfile
	docker build -t videotracker .
removeweb:
	docker rm -f videotrackerApp
removedb:
	docker rm -f mongodb
rundb: removedb 
	docker run --name mongodb -d -p 27017:27017 -v /root/data/db:/data/db mongo
#	docker run --net=twp --name db -d mongo        
runweb: removeweb
	docker run -d -p 3000:3000 --link mongodb:db --name videotrackerApp videotracker
#        docker run --net=twp -p 3000:3000 --name videotrackerApp videotracker
