function set_color(element, color){
    // set the background-color of an element
    element.style['background-color'] = color;
};

function identical(array){
    for(let i = 0; i < array.length - 1; i++){
        if(array[i] !== array[i + 1]){
            return(false)
        };
    };
    return(true)
};

function cycle_cols(obj){
    let old_col = obj.current;
    let new_col = obj.colors.shift();
    set_color(obj.element, new_col);
    obj.current = new_col;
    obj.colors.push(old_col);
};

function cycle_all_cols(obj_list){
    // cycles the color on all objects in the list
    console.log("updating colors")
    let num_objs = obj_list.length;
    for (let i = 0; i < num_objs; i++) {
        let obj = obj_list[i];
        cycle_cols(obj);
    };
};

function make_div_obj(id, colors, linked_ids){
    // get an element and make a dictionary with color information and linked objects
    // id = str, id of the div to get
    // colors = array of str color names
    // linked_ids = array of str id's of other divs to link with
    let obj = {
        id: id,
        element : document.getElementById(id),
        og: window.getComputedStyle(document.getElementById(id))['background-color'],
        current: window.getComputedStyle(document.getElementById(id))['background-color'],
        colors: colors,
        linked_ids: linked_ids
    };
    return(obj);
};

function find_div_obj_by_id(id, obj_list){
    // search the obj_list for a div_obj with the matching id
    let num_objs = obj_list.length;
    for (let i = 0; i < num_objs; i++) {
        let obj = obj_list[i];
        if(obj['id'] === id){
            return(obj)
        };
    };
    // console.log('didnt find a matching linked_obj in the obj_list for id: ' + id);
    // return() // ?? What to do here???
};

function get_linked_objs(div_obj, obj_list){
    // searches the obj_list object list for all div_obj objects that have a matching linked_id
    let matches = [];

    // find the matching objects in the list for each linked id
    for (let i = 0; i < div_obj['linked_ids'].length; i++) {
        let linked_id = div_obj['linked_ids'][i];
        let linked_objs = find_div_obj_by_id(linked_id, obj_list);
        matches.push(linked_objs);
    };
    return(matches);
};

function get_current_cols(obj_list){
    // return an array of the current colors for all the objects in the list
    let current_colors = [];
    for (let i = 0; i < obj_list.length; i++) {
        let obj = obj_list[i]
        let col = obj.current
        current_colors.push(col)
    };
    return(current_colors);
};

function check_win(gameboxes, win_color){
    // checks the state of the game board to see if the play won
    console.log('checking gameboard');
    let current_colors = get_current_cols(gameboxes);
    current_colors.push(win_color.code);
    let colors_identical = identical(current_colors);
    if (colors_identical === true){
        console.log("you win");
        // alert("you win");
        display_win();
    };
};

function display_win(){
    // print a win statement to the page
    var element = document.createElement("h1");
    var para = document.createTextNode('you win!');
    element.appendChild(para);
    document.getElementsByTagName('body')[0].appendChild(element);
};

function set_event_listeners(gameboxes, win_color){
    // add event listener to update all objects on click
    let num_boxes = gameboxes.length;
    for (let i = 0; i < num_boxes; i++) {
        let box_obj = gameboxes[i];

        console.log('adding click action listener for ' + box_obj.id + ' div');

        // on click, update the div color, and the color of the assocaited div
        box_obj.element.addEventListener("click", (event) => {
            console.log(box_obj.id + ' was clicked');
            let current_colors = get_current_cols(gameboxes);

            cycle_cols(box_obj);
            let linked_objs = get_linked_objs(box_obj, gameboxes);
            cycle_all_cols(linked_objs);

            current_colors = get_current_cols(gameboxes);
            check_win(gameboxes, win_color);
        });
    };
};
