// Types of JS properties

// 1. Data Properties: These are the normal kind of properties that constitute most of the JavaScript code
const obj = {
  name: 'Arfat',
  id: 5
}
obj.name // => 'Arfat'

// 2. Accessor Properties: a combination of two functions: the get and the set function
const accessorObj = {
  get name() {
    return 'Arfat';
  }
};

// Reading accessor properties do not need to use parentheses to invoke the function
accessorObj.name; // => 'Arfat'
accessorObj.name = "Jerry" // => the update won’t happen because we don’t have a corresponding setter function for the name key

const accessorObj = {
  _name: 'Arfat',
  get name() {
    return this._name;
  },
  set name(value) {
    this._name = value;
  }
};

// In the getter function, we can modify or override the property before returning its value
const obj = {
  get name() {
    return this._name.toUpperCase();
  },
  set name(value) {
    this._name = value;
  },
  get id() {
    return this._id.toString(2); // Returns binary of a number
  },
  set id(value) {
    this._id = value;
  }
}

obj.name = 'Arfat';
obj.name; // => 'ARFAT'

obj.id = 5;
obj.id; // => '101

// Why would anybody use accessor properties if normal data properties exist?
// i.   There are often cases where you need to log the property access or maintain a history of all the
//      values that the property has had. Accessor properties give us the full power of a function with the
//      ease of use of object properties
// ii.  Hiding the internal representation of the property while exposing a property using an alternative representation
// iii. Encapsulation of behavior associated with getting or setting the property - this allows additional functionality
//      (like validation) to be added more easily later, etc

// So how does JavaScript know which is an accessor property and which is a data property? Ans: Object Property Descriptors
// Property Attributes: Every key of an object contains a set of property attributes that define the characteristics of
// the value associated with the key. They can also be thought of as meta-data describing the key-value pair. In short,
// attributes are used to define and explain the state of object properties.

// There are six property attributes: [[Value]], [[Get]], [[Set]], [[Writable]], [[Enumerable]], [[Configurable]]
// Why have we wrapped the attribute names in [[]]? Double square brackets mark internal properties used by the ECMA specifications.
const object = {
  x: 5,
  y: 6
};
Object.getOwnPropertyDescriptor(object, 'x')
/*
{
  value: 5,
  writable: true,
  enumerable: true,
  configurable: true
}
*/

// [[Value]] - It stores the value retrieved by a get access of the property.
// [[Get]] - It stores the reference to the function that we declare while making a getter property
// [[Set]] - It stores the reference to the function that we declare while making a setter property
// [[Writable]] - This is a boolean value. It tells whether we can overwrite the value or not.
// [[Enumerable]] - This is also a boolean value. This attribute dictates whether the property is going to appear in for-in loops or not.
// [[Configurable]] - This is a boolean too. When it is false, attempts to delete the property will fail.

// All six properties do not exist for each property type.
//  -  For Data Properties, only value, writable, enumerable and configurable exists.
//  -  For Accessor Properties, instead of value and writable, we have get and set.


// Working with Descriptors

// 1. Object.getOwnPropertyDescriptor - We have seen this function above. It takes an existing object, and a property name.
//                                      It returns either undefined or an object containing the descriptors.

// 2. Object.defineProperty - It’s a static method on Object that can define or modify a new property on a given object. It takes three
//                            arguments — the object, the property name, and descriptors. It returns the modified object.
const obj = {};

// Remember that if you fail to specify any more property attributes such as enumerable or configurable, the default value is set to false
// In this case, id has writable, enumerable, and configurable all set to false.
Object.defineProperty(obj, 'id', {
  value: 42
});

console.log(obj); // => { } -> Since id property is not enumerable, it is not printed
console.log(obj.id); // => 42

Object.defineProperty(obj, 'name', {
  value: 'Arfat',
  writable: false,
  enumerable: true,
  configurable: true
});

console.log(obj.name); // => 'Arfat'

obj.name = 'Arfat Salman'

console.log(obj.name); // => 'Arfat' (instead of 'Arfat Salman')

Object.defineProperty(obj, 'lastName', {
  value: 'Salman',
  enumerable: false,
});

console.log(Object.keys(obj)); // => [ 'name' ]

delete obj.id; // won't delete because id's configurable is set to false (default)

console.log(obj.id); // => 42

// batch version of defineProperty called Object.defineProperties
Object.defineProperties(obj, {
  property1: {
    value: 42,
    writable: true
  },
  property2: {}
});

console.log(obj.property1); // => 42


// Protecting Objects
// There are often cases where we don’t want anyone to tamper with our objects. Given the flexibility of JavaScript,
// it’s really easy to mistakenly re-assign properties of objects that we are not meant to touch. There are three major
// ways of protecting objects in JavaScript.

/*
1. Object.preventExtensions
The Object.preventExtensions method prevents new properties from ever being added to an object (i.e. prevents future
extensions to the object). It takes an object and makes it non-extensible. Note that the properties can be deleted though.
You can check whether an object is non-extensible or not by using Object.isExtensible. If it returns true, you can add
more properties to the object.
*/
const obj = {
  id: 42
};
Object.preventExtensions(obj);
obj.name = 'Arfat';
console.log(obj); // => { id: 42 }

/*
2. Object.seal - The seal method seals an object. It means —
- It prevents new properties from being added just like Object.preventExtensions.
- It marks all existing properties as non-configurable.
- Values of present properties can still be changed as long as they are writable.
- In short, it prevents adding and/or removing properties.

You can use Object.isSealed to test whether an object has been sealed or not.
*/
const obj = {
  id: 42
};

Object.seal(obj);
delete obj.id // (does not work)

obj.name = 'Arfat'; // (does not work)

console.log(obj); // => { id: 42 }

Object.isExtensible(obj); // => false

Object.isSealed(obj); //=> true

/*
3. Object.freeze - freeze is the maximum protection any object can have in JavaScript.
- It seals the object using Object.seal
- It also prevents modifying any existing properties at all.
- It also prevents the descriptors from being changed as the object is already sealed.

You can check whether an object is frozen or not using the Object.isFrozen function.
*/
const obj = {
  id: 42
};

Object.freeze(obj);

delete obj.id // (does not work)

obj.name = 'Arfat'; // (does not work)

console.log(obj); // => { id: 42 }

Object.isExtensible(obj); // => false
Object.isSealed(obj); // => true
Object.isFrozen(obj); // => true
