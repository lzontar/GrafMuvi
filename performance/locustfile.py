# -*- coding: utf-8 -*-
"""
Created on Sat Dec 14 01:59:13 2019

@author: Luka
"""

from locust import HttpLocust, TaskSet, between
from locust.events import request_failure


def status(l):
    l.client.get("/status")


def get_similar_movies_by_id(l):
    l.client.get("/api/id/tt0068646")


def get_similar_movies_by_title(l):
    l.client.get("/api/title/The godfather/1972")


class LocustBehavior(TaskSet):
    tasks = {
        status: 100,
        get_similar_movies_by_id: 100,
        get_similar_movies_by_title: 100
    }


class LocustUser(HttpLocust):
    task_set = LocustBehavior
    wait_time = between(5.0, 9.0)


def on_failure(request_type, name, response_time, exception, **kwargs):
    print(exception.request.url)
    print(exception.request.headers)
    print(exception.request.body)


request_failure += on_failure
