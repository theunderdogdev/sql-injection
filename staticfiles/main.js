$(function () {
  $("#form-switch").on("click", function () {
    const to = $(this).data("to");
    const from = $(this).data("from");
    $("form#" + from).slideUp("slow");
    setTimeout(() => {
      $("form#" + to).slideDown("slow");
    }, 500);
    $(this).data("from", to);
    $(this).data("to", from);
    $(this).text("Switch to: " + from);
  });

  $("#mode-switch").on("click", function () {
    $(this).data(
      "mode",
      $(this).data("mode") === "secure" ? "insecure" : "secure"
    );
    $(this).text("Mode: " + $(this).data("mode"));
  });
  $("form#register").on("submit", function (evt) {
    evt.preventDefault();
    console.log("reg submit");
    const isSecure = $("#mode-switch").data("mode") === "secure";

    const data = serializeObject($(this).serializeArray());
    $.ajax({
      url: `${isSecure ? "/api" : "/api/insecure"}/auth/register`,
      method: "post",
      data: JSON.stringify(data),
      contentType: "application/json",
      success(res, status, xhr) {
        console.log(res);
        const { statusCode, message, data } = res;
        if (statusCode === 200) {
          console.log(data, message);
        }
        if (statusCode === 422) {
          console.log(message);
        }
      },
    });
  });

  $("form#login").on("submit", function (evt) {
    evt.preventDefault();
    const data = serializeObject($(this).serializeArray());
    const isSecure = $("#mode-switch").data("mode") === "secure";
    $.ajax({
      url: `${isSecure ? "/api" : "/api/insecure"}/auth/login`,
      method: "post",
      data: JSON.stringify(data),
      contentType: "application/json",
      success(res, status, xhr) {
        console.log(res);
        const { statusCode, message, data } = res;
        if (statusCode === 200) {
          console.log(data, message);
        }
        if (statusCode === 422) {
          console.log(message);
        }
      },
    });
  });
});
