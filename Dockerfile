FROM node:8.11.1

WORKDIR /usr/src/smart-brain-api

# copy everything from the root directory (./) to the container's root directory (./)
COPY ./ ./

# Run is an image build stack. The state of the image after a run command will be committed to the docker image. 
# you can have multiple run statements to build up the docker image to it's final state. 
RUN npm install


#CMD is somthing that executes automatically when executing the build command (you can only have one CMD)
CMD ["/bin/bash"]