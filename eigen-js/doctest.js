/**
 * This function adds one to its input.
 * @param {String} string any number
 * @returns {Number} that number, plus one.
 */
function addOne(input) {
    return input + 1;
}

/**
 * A Dense matrix object
 */
class DenseMatrix {
    /**
     * Builds a matrix
     * @param {String} name Matrix name (BIS)
     */
    constructor(name) {

    }

    /**
     * Add to the matrix
     * @param {Number} a First value
     * @param {Number} b Second value
     * @returns {Number} Added value
     * @example
     * const a = 1;
     * const b = 2;
     * return add(a, b);
     */
    static add(a, b) {
        return a + b
    }

    /**
     * Transpose a matrix
     * that method doesn't tranpose a matrix in place
     * @param {DenseMatrix} mat matrix
     * @returns {DenseMatrix} Transposed matrix
     * @example
     * const mat = eig.DenseMatrix(2, 3);
     * return transpose(mat);
     */
    static transpose(mat) {
        return mat
    }

    /**
     * Add all values in place
     * That method should be the prime way of adding values to a dense matrix
     * @param {Array} values Values to add
     * @param {Boolean} reverse Whether the array shoud be reversed
     * @returns {Boolean} Success
     */
    static addAll(values, reverse) {
        return false
    }

    /**
     * Transpose a matrix
     * that method tranposes a matrix in place
     * @returns {DenseMatrix} Transposed matrix
     * @example
     * const mat = eig.DenseMatrix(2, 3);
     * return mat.transpose();
     */
    transpose() {
        return this
    }

    /**
     * Remove matrix
     */
    delete() {

    }
}