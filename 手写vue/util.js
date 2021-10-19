const remove = function(array, item) {
    const index = array.indexOf(item);
    if (~index) {
        array.splice(index, 1);
    }
    return index;
}