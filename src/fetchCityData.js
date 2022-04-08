// taken from Dan's june example of React 18 (in the docs)
// https://17.reactjs.org/docs/concurrent-mode-suspense.html and references https://codesandbox.io/s/frosty-hermann-bztrp



export function fetchCityData(id) {
  let cityPromise = fetchCity(id);
  return {
    cities: wrapPromise(cityPromise)
  };
}

function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

function fetchCity(id) {
  console.log("fetch city...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("fetched city");
      resolve({
        name: "Ringo Starr"
      });
    }, 3000);
  });
}

function fetchPosts() {
  console.log("fetch posts...");
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("fetched posts");
      resolve([
        {
          id: 0,
          text: "I get by with a little help from my friends"
        },
        {
          id: 1,
          text: "I'd like to be under the sea in an octupus's garden"
        },
        {
          id: 2,
          text: "You got that sand all over your feet"
        }
      ]);
    }, 6000);
  });
}
