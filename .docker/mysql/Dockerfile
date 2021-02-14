FROM mysql:5.7 

# install node lts version
RUN apt-get update && apt-get install nodejs npm -y 
RUN apt-get update && apt-get install curl -y 

RUN npm install -g n
RUN n lts
RUN apt purge nodejs npm -y && apt autoremove -y
