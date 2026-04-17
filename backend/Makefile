# dockerbuild:
# 	sudo docker build -t benchmarking-backend . \
# 	docker build -t registry.gitlab.com/mo3tamad/cxapp . \
# 	docker push registry.gitlab.com/mo3tamad/cxapp 

dockercontainer:
	sudo docker run -p 5000:5000 -d benchmarking-backend 

dockerdev:
	sudo docker compose -f stack.yaml up -d

.PHONY: dockerbuild dockercontainer dockerdev