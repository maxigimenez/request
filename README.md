# request

## GET

```JavaScript
request.get(url, query);
```

```JavaScript
request.get(url, {
	key: 'value'
})
.success(function(response, xhr){
	console.log(response);
})
.error(function(message, xhr){
	console.log(message);
})
.always(function(){
	console.log('always');
});
```

## POST

```JavaScript
request.post(url, data, query);
```

```
request.post(url, {
	key: 'value'
}, {
	key: 'value'
})
.success(function(response, xhr){
	console.log(response);
})
.error(function(message, xhr){
	console.log(message);
})
.always(function(){
	console.log('always');
});
```