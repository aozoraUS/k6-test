// import necessary modules
import { check } from "k6";
import http from "k6/http";
import { group, sleep } from "k6";

// define configuration
export const options = {
  // define thresholds
  /*
  thresholds: {
    http_req_failed: [{ threshold: "rate<0.01", abortOnFail: true }], // availability threshold for error rate
    http_req_duration: ["p(99)<1000"], // Latency threshold for percentile
  },
  */
  // define scenarios
  scenarios: {
    breaking: {
      executor: "ramping-vus",
      stages: [
        { duration: "10s", target: 5 },
        { duration: "20s", target: 10 },
        { duration: "20s", target: 15 },
        { duration: "20s", target: 20 },
        { duration: "20s", target: 25 },
        { duration: "20s", target: 30 },
        { duration: "20s", target: 50 },
        { duration: "20s", target: 60 },
        { duration: "20s", target: 80 },
        //....
      ],
    },
  },
};

export default function () {
  // define URL and request body

  group("front /groups", function () {
    const params = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = http.get(`${__ENV.BACKEND_BASE_URL}/groups`, params);
    sleep(1);

    // check that response is 200
    check(res, {
      "response code was 200": (res) => res.status == 200,
    });
    sleep(1);
  });

  group("front /index", function () {
    const params = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = http.get(`${__ENV.BACKEND_BASE_URL}/news`, params);
    sleep(1);

    // check that response is 200
    check(res, {
      "response code was 200": (res) => res.status == 200,
    });
  });

  group("配布状況の確認", function () {
    const params = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const groups = http.get(`${__ENV.BACKEND_BASE_URL}/groups`).json();

    for (let i = 0; i < groups.length; i++) {
      const res = http.get(
        `${__ENV.BACKEND_BASE_URL}/groups/${groups[i].id}/events/`,
        params
      );

      // check that response is 200
      check(res, {
        "response code was 200": (res) => res.status == 200,
      });
    }

    sleep(1);
  });
}
