class Utils {
    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

export default Utils;