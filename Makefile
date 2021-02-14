# docker コンテナを立ち上げます。
up:
	docker-compose up -d --build
.PHONY: up

# docker コンテナを切断します。
down:
	docker-compose down
.PHONY: down

# mysql コンテナに bashで接続します。
mysql:
	docker exec -it mysql bash 
.PHONY: mysql

# コンテナを再起動します。
restart:
	make down && make up
.PHONY: restart

kill_container:
	docker stop $(docker ps -q)
.PHONY: kill_container


