// import necessary modules
import { check } from "k6";
import http from "k6/http";
import { group, sleep } from "k6";

/*
引数
BACKEND_BASE_URL
GROUP_ID
EVENT_ID
USER_ID
USER_TOKEN
*/

// define configuration
export const options = {
  // define scenarios
  /*
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
  */
};

export default function () {
  // define URL and request body
  group("front /index", function () {
    const params = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${__ENV.USER_TOKEN}`,
      },
    };

    const res = http.post(
      `${__ENV.BACKEND_BASE_URL}/groups/${__ENV.GROUP_ID}/events/${__ENV.EVENT_ID}/tickets`,
      params
    );
    sleep(1);

    // check that response is 200
    check(res, {
      "response code was 200": (res) => res.status == 200,
    });
  });
}
