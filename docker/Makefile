build:
	docker build . -f RenderDockerFile -t seccurate:render
	docker build . -f CrawlerDockerFile -t seccurate:crawler
	docker build . -f APIGatewayDockerFile -t seccurate:apiGateway
	docker build . -f MySQLDockerFile -t seccurate:mySQL
	docker build . -f VulnerabilitiesDockerFile -t seccurate:vulnerabilities
	docker build . -f ClientDockerFile -t seccurate:client


startRendering:
	docker-compose up -d rendering

startCrawler:
	docker-compose up -d crawler

startMySQL:
	docker-compose up -d mySQL

startApiGateway:
	docker-compose up -d api_gateway

startVulns:
	docker-compose up -d vulnerabilities

startClient:
	docker-compose up -d client

startAll: startRendering startCrawler startMySQL startApiGateway startVulns startClient