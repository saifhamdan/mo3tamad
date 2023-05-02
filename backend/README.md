## Docker

Every micro service must run in a docker container to that end
the blueprint have a DockerFile which will give you how
you will make a images, we need to make sure that
the service will run without issues so we use Docker stage build

When we finish from a working Sprint we need to push images to project registry

```
loging

docker login registry.gitlab.com

build for dev env

docker build -t registry.gitlab.com/mo3tamad/cxapp .

push

docker push registry.gitlab.com/mo3tamad/cxapp

```
