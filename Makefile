build: Dockerfile
	docker build -t videotracker .

rundb: 
	docker run --name mongodb -d -p 27017:27017 mongo

runweb: 
	docker run -d -p 3000:3000 --link mongodb:db --name videotrackerApp videotracker
