// import necessary modules
import { check } from "k6";
import http from "k6/http";
import { group, sleep } from "k6";

/*
引数
BACKEND_BASE_URL
GROUP_ID
*/

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
  group("団体個別ページロード時 /groups/_groupid", function () {
    const params = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const event_res = http
      .get(`${__ENV.BACKEND_BASE_URL}/groups/${__ENV.GROUP_ID}/events`, params)
      .json();
    for (let i = 0; i < event_res.length; i++) {
      const ticket_res = http.get(
        `${__ENV.BACKEND_BASE_URL}/groups/${__ENV.GROUP_ID}/events/${event_res[i].id}/tickets`
      );

      check(ticket_res, {
        "response code was 200": (res) => res.status == 200,
      });
    }
    sleep(1);

    // check that response is 200
    check(event_res, {
      "response code was 200": (res) => res.status == 200,
    });
  });
}
