// import necessary modules
import { check } from "k6";
import http from "k6/http";
import { group, sleep } from "k6";

/*
引数
BACKEND_BASE_URL
GROUP_ID
EVENT_ID
USER_TOKEN
*/

// define configuration
export const options = {
  // define scenarios
  scenarios: {
    breaking: {
      executor: "ramping-vus",
      stages: [
        { duration: "20s", target: 4000 },
        //....
      ],
    },
  },
};

export default function () {
  // define URL and request body
  group("front /index", function () {
    const payload = JSON.stringify({});

    const params = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${__ENV.USER_TOKEN}`,
      },
    };

    const res = http.post(
      `${__ENV.BACKEND_BASE_URL}/spectest/groups/${__ENV.GROUP_ID}/events/${__ENV.EVENT_ID}/tickets`,
      payload,
      params
    );
    sleep(1);

    // check that response is 200
    check(res, {
      "response code was 200": (res) => res.status == 200,
    });
  });
}
