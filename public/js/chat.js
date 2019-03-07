
var socket = io();


const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('connect', function () {
    console.log("Connected to server.")
});
socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        time: formattedTime,
        from: message.from
    });
    jQuery('#messages').append(html);
});
socket.on('newLocationMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
        from: message.from,
        time: formattedTime,
        url: message.url
    })
    jQuery('#messages').append(html);
});

socket.on('disconnect', function () {
    console.log("Disconnected from server.");
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageInputField = jQuery('[name=message]');
    if (messageInputField.val()) {
        socket.emit('createMessage', {
            from: "User",
            text: messageInputField.val()
        }, function () {
            messageInputField.val('');
        });
    } else {
        messageInputField.focus();
    }
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location')
        alert('Unable to fetch location.');
    });
});

socket.emit('join', { username, room })