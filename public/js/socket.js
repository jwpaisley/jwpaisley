var socket = io();

socket.on('alert', function (message) {
  console.log(message);
});

socket.on('returnArticles', function(articles){
  console.log(articles);
  articles.forEach((row) => {
    $('#posts').append('<div class="post-preview">' +
      '<a href="' + row.type + '/' + row.id + '">' +
        '<img class="post-img" src="img/' + row.image + '" />' +
        '<h2 class="post-title">' + row.title + '</h2>' +
        '<h3 class="post-subtitle">' + row.subtitle + '</h3>' +
      '</a>' +
      '<p class="post-meta">' + row.date + '</p>' +
    '</div>' +
    '<hr>');
  });
});
