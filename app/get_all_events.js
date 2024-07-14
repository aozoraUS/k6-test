// import necessary modules
import { check } from "k6";
import http from "k6/http";
import { group, sleep } from "k6";

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
        { duration: "50s", target: 1000 },
        { duration: "50s", target: 2000 },
        //....
      ],
    },
  },
};

export default function () {
  // define URL and request body
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
