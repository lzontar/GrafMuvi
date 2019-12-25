# Performance measuring with Locust

To understand better how our API is behaving under pressure or in other words, how does our API perform when it's used by larger number of users at the same time. Load-testing is a type of non-functional testing which is conducted to understand the behavior of the application under some kind of pressure \(such as certain amount of users making certain amount of requests\). We will use [Locust](https://locust.io/) for to load-test our API. It allows you to write tests in pure Python and simulate users making requests.

Test code is described in file [_performance/locustfile.py_](https://github.com/lzontar/GrafMuvi/blob/master/performance/locustfile.py).

```text
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
```

In our _locustfile.py_ we do the following:

* Importing necessary libraries
* Test path: /status
* Test path: /api/id/:id
* Test path: /api/title/:title/:year
* Locust behavior: at each iteration each user makes 100 calls of functions status, get\_similar\_movies\_by\_id and get\_similar\_movies\_by\_title
* Locust user is defined by Locust behavior and the waiting time between each user hatched
* function _on\_failure_ is used for debugging

To run tests we first have to run Locust web interface by executing the following command where we have our _locustfile.py_ located \(in our case in folder _performance_\):

```text
$ locust
```

Our web interface is now running on the default address: [http://localhost:8089](http://localhost:8089)

Once we have our web interface running, we have to set the amount of users \(in our case - 1000\) that we want to simulate and how many users will be hatched \(created\) each second. Users are created gradually, i.e. we have to define how many users are hatched per second \(in our case - 10\). Lastly, we have to set the URL of the server that we are testing. Since we want to be testing the API that is running on our VM created by _Vagrant_ and in our _Vagrantfile_, we map guest port 8080, where our API is running, to host port 8082. This means that we have test our server on URL: [http://localhost:8082](http://localhost:8082).

![](../.gitbook/assets/locust_first.png)

## Results

After running Locust load-testing for 30 minutes, Locust calculates a bunch of different measures for us and even generates few charts.

![](../.gitbook/assets/locust_statistics.png)

On the image above we can see:

* How many requests were made,
* How many times a request failed,
* Average and median response times,
* Number of requests per second \(RPS\),
* Average size.

As said before Locust generates charts for us. The first chart generated tells us the total requests made per second over time. Curiously enough, we can notice a significant fall around 11:00 p.m., at which time the majority of failures probably occurred. We may assume that this was not due to malfunctioning of VM or API but most likely just the inconsistency of internet connection.

![](../.gitbook/assets/locust_total_requests_per_second.png)

Second chart describes the response times over time. In this case we notice a significant ascent around 11:00 p.m., which indicates that connection with server might not have been available at that time.

![](../.gitbook/assets/locust_response_times.png)

Lastly, we can see how locusts were hatching. Locust creates users linearly and from the graph below we can see how the number of users was rising. Consequently the total number of requests during the creation of users and the response times were also rising.

![](../.gitbook/assets/locust_number_of_users.png)

## Conclusions

Even though that a server failing 0.47% of requests can be considered as quite reliable, we still have to somehow explain why is it failing. Based on the fact that most failures occurred in short time interval and that we have tested it on a machine with unstable Wi-Fi, we can assume that our API failed because of network. Furthermore, we can see that RPS was quite steady over the time we were testing our API. Curiously enough, we can also notice that during the time that the number of users was rising, RPS was rising as well, which is why we can conclude that our server can handle 1000 users making simultaneous requests without any problems.

