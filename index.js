const imageForm = document.querySelector("#imageForm");
const imageInput = document.querySelector("#imageInput");

imageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const file = imageInput.files[0];

  // get secure url from our server
  const url =
    "https://lychiebucket.s3.ap-northeast-1.amazonaws.com/test/79507f88208126e8114f7428cf38813a?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAW3MECI7RKOQQZIVB%2F20240407%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20240407T045822Z&X-Amz-Expires=3600&X-Amz-Signature=18256571c0bd00874b2e3769a0f92863bc9a8a15b155e3956f3a3000d41c9778&X-Amz-SignedHeaders=host&x-id=PutObject";

  // post the image direclty to the s3 bucket
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: file,
  });

  const imageUrl = url.split("?")[0];
  console.log(imageUrl);

  // post requst to my server to store any extra data

  const img = document.createElement("img");
  img.src = imageUrl;
  document.body.appendChild(img);
});
