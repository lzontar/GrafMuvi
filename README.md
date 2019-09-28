# eGuarda
## Description
**eGuarda** is a web service, a statistic-oriented REST API, with which users will be able to post a report about a (possible) criminal event or suspicious occurrence. This data will be stored in [mongoDB](https://www.mongodb.com/) database and will be accessible to users. Besides gathering the data about criminal events, *eGuarda* will support visualization (charts and maps) of that data. Developers will be able to add the visualization template to their site from which the users will be able to see statistics about criminal events nearby. This may be useful for people who don't know their surroundings (E.g. travelers);
## Documentation
Documentation of [*eGuarda*](https://eguarda.docs.apiary.io/#) web service (developed by *Apiary*).
## Usage
*Coming soon*.
## Technology
### Python and Django
For the main development tools we will use [Python](https://www.python.org/) (as the main language) and *Django* (as a web framework). With its grand community Python appears to be one of the main back-end languages with [Django](https://www.djangoproject.com/) and [Flask](https://palletsprojects.com/p/flask/) as the most popular web frameworks to make development easier. In this project we will use *Django* because of its speed and security.
### Travis CI
[Continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) is a development practice which requires developers to commit their code to a shared repository very often (several times a day). We will use [Travis CI](https://travis-ci.com/) as our continuous integration system.
### pytest
Test-driven development([TDD](https://en.wikipedia.org/wiki/Test-driven_development)) is software development process which encourages developers to first write tests and then the code. This has proven to fasten and improve the development cycle. We will use TDD in our project as well and [pytest](https://docs.pytest.org/en/latest/) is a framework, which makes it easy to write unit (or other kinds of) tests in Python.
### Apiary
Every service has to have a good documentation, where developers will be able to see how to use the service. For this we will use [Apiary](https://apiary.io/), which is a platform for API design, development and documentation. We will use only the last part.
### logging (Python)
Logging is a very useful tool, because it can develop a better understanding of how program works. Python offers an integrated module [logging](https://docs.python.org/3/library/logging.html), which we will use in our project.
### Google Cloud
We want this project to have a cloud infrastructure and therefore we will use [Google Cloud](https://cloud.google.com/) computing services.
### Database
To store the data about criminal events we will use either [Firebase](https://firebase.google.com/) (database produced by Google, which is part of *Google Cloud* services) or [MongoDB](https://www.mongodb.com/) (one of the most popular databases for modern databases).
### FusionCharts
[FusionCharts](https://www.fusioncharts.com/) is a Python-supported API, which we will use to create responsive charts which will be included in our template.
### GeoDjango
[GeoDjango](https://docs.djangoproject.com/en/2.2/ref/contrib/gis/) is a Python-supported API, which we will use to create responsive maps which will be included in our template.
## Wish to contribute?
### Environment setup
1. Fork repository and pull the content
2. Execute:
```bash
  pip install -r requirements.txt
```
### Make changes
1. Pull the latest version of repository
2. Make changes
3. Commit to your forked repository
4. Create a Pull Request to branch **contributions**
