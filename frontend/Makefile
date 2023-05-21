dockerbuild:
	sudo docker build -t benchmarking-frontend .

dockercontainer:
	sudo docker run -p 3000:3000 -d benchmarking-frontend . 

.PHONY: dockerbuild dockercontainer