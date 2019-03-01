

var socket = io();

socket.on('connect', function () {
    console.log("Connected to server.")
});
socket.on('newMessage', function (message) {
    var fomattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    li.text(`${message.from} ${fomattedTime}: ${message.text}`)
    jQuery('#messages').append(li);
});
socket.on('newLocationMessage', function (message) {
    var fomattedTime = moment(message.createdAt).format('h:mm a');
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My Current Location</a>');
    
    li.text(`${message.from} ${fomattedTime}: `);
    a.attr('href',message.url);
    li.append(a)
    jQuery('#messages').append(li);
});

socket.on('disconnect', function () {
    console.log("Disconnected from server.");
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();
    var messageInputField = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: "user",
        text: messageInputField.val()
    }, function () {
        messageInputField.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled','disabled').text('Sending...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send Location');
        socket.emit('createLocationMessage',{
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        locationButton.removeAttr('disabled').text('Send Location')
        alert('Unable to fetch location.');
    });
});