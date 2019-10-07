const TIMEOUT_MS = 10000; // 10 seconds timeout

// Add all endpoints here
const endpoints = {
  getImages: q => `https://pixabay.com/api/?key=9656065-a4094594c34f9ac14c7fc4c39&q=${q}&image_type=photo`
};

// Small utility function i usually use to make sure we handle timeouts
function timeoutPromise(promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('promise timeout'));
    }, TIMEOUT_MS);
    promise.then(
      res => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      err => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}

// Main fetch request function
async function request(path, method = 'GET', body = {}) {
  const options = {
    method: method
  };

  if (method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    let res = await timeoutPromise(fetch(path, options));
    let data = await res.json();
    if (!res.ok) {
      let message = data.message || 'Something went wrong, please try again.';
      return Promise.reject({ message });
    }
    return data;
  } catch (error) {
    return Promise.reject({
      message: 'Something went wrong, please try again.',
    });
  }
}

// Get images api function
export function getImages(q = "Beautiful landscape") {
  return request(endpoints['getImages'](encodeURIComponent(q)));
}
