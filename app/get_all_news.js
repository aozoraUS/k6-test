// import necessary modules
import { check } from "k6";
import http from "k6/http";
import { group, sleep } from "k6";

const backend_base_url = "http://localhost:8000";

// define configuration
export const options = {
  // define thresholds
  thresholds: {
    http_req_failed: [{ threshold: "rate<0.01", abortOnFail: true }], // availability threshold for error rate
    http_req_duration: ["p(99)<1000"], // Latency threshold for percentile
  },
  // define scenarios
  scenarios: {
    breaking: {
      executor: "ramping-vus",
      stages: [
        { duration: "10s", target: 5 },
        { duration: "50s", target: 10 },
        { duration: "50s", target: 15 },
        { duration: "50s", target: 20 },
        { duration: "50s", target: 30 },
        //....
      ],
    },
  },
};

export default function () {
  // define URL and request body
  group("front /index", function () {
    const params = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const res = http.get(backend_base_url + "/news", params);
    sleep(1);

    // check that response is 200
    check(res, {
      "response code was 200": (res) => res.status == 200,
    });
  });
}
