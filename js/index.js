// send request to server and get data for input name then call functions to show result
const nameInput = document.querySelector('#username');
const submitButton = document.querySelector('.submit');
const clearButton = document.querySelector('.clear');
const avatar = document.querySelector('.avatar');
const FullName = document.querySelector('.name');
const blog = document.querySelector('.blog');
const bio = document.querySelector('.bio');
const address = document.querySelector('.address');
const errorField = document.querySelector('#error_field');


//getInfo function will save the username values. if the data was already in local storage it will print that we are using
//the data from local storage. if not, it will get the data from server. if it was successful, it will check the username
//exict or not, 
async function getInfo(e) {
    let username = nameInput.value;
    e.preventDefault();
        try {

            let data = await JSON.parse(window.localStorage.getItem(username));

            if (data != null) {
                getUserInfo(data);
                errorField.innerHTML = '<p>' + "Loaded From Local Storage."+ '</p>';
                console.log(data);
            }
            else{
                let response = await fetch(`https://api.github.com/users/` + username);
                let obj = await response.json();
                if (response.status != 200) {
                    getDummyInfo();
                    if(response.status == 404){
                        errorField.innerHTML = '<p>' + "User not found!" + '</p>';
                    }
                    else if(response.status == 403){
                        errorField.innerHTML = '<p>' + "Couldn't fetch! Rate limit exceeded." + '</p>';
                    
                    }
                    else { 
                        errorField.innerHTML = '<p>' + "Unkown Error! "+ response.status + '</p>';
                    }
                    return Promise.reject(`Request failed with error ${response.status}`);
                }
                errorField.innerHTML = '<p>' + "" + '</p>';
                getUserInfo(obj);
                window.localStorage.setItem(username, JSON.stringify(obj));
            }

        } catch (e) {
            // check the network error
            console.log(e);
            if(e.message == "NetworkErroe when attemping to fetch resource."){
                errorField.innerHTML = '<p>'+"Network Error!" + '</p>';
            }
        }
}

function getDummyInfo(){
    avatar.innerHTML = '<img src="' + "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" + '" alt="avatar" class="avatar">';
    FullName.innerHTML = '<span>' + 'John Doe' + '</span>';
    blog.innerHTML = '<span>' + "github.com" + '</span>';
    bio.innerHTML = '<span>' + "Well, no users found! :(" + '</span>';
}

// showing result to user
function getUserInfo(obj) {
    avatar.innerHTML = '<img src="' + obj.avatar_url + '" alt="avatar" class="avatar">';
    if(obj.name==null)
    {FullName.innerHTML = '<span>'+ 'Name: -'+'</span>'; }
    else
    FullName.innerHTML = '<span>' + 'Name: ' + obj.name + '</span>';
    if(obj.blog==null)
    {blog.innerHTML = '<span>' + 'Blog: -' + '</span>';}
    else
    blog.innerHTML = '<span>' + 'Blog: ' + obj.blog + '</span>';
    if(obj.bio==null)
    {bio.innerHTML = '<span>' + 'Bio: -' + '</span>';}
    else
    bio.innerHTML = '<span>' + 'Bio:' + obj.bio + '</span>';
    if(obj.address==null)
    {address.innerHTML = '<span>' + 'Location: -' + '</span>';}
    else
    address.innerHTML = '<span>' + 'Location: ' + obj.location + '</span>';
    
}


submitButton.addEventListener('click', getInfo);
clearButton.addEventListener('click', removeSavedAnswer);
window.localStorage.clear();