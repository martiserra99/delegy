# Delegy

The `delegy` utility function is used to delegate a task to a corresponding function based on the type of a value.

To illustrate better how it works imagine we had the following types:

```ts
interface Person<T extends Pet> {
  pet: T;
}

type Pet = Dog | Cat;

interface Dog {
  meta: { type: "dog" };
  data: { name: string };
}

interface Cat {
  meta: { type: "cat" };
  data: { name: string };
}
```

If we wanted to create a function called `info` that receives a person as
argument and returns different data depending on the pet that the person has we
could use the `delegy` function the following way:

```ts
import { delegy } from "delegy";

interface Person<T extends Pet> {
  pet: T;
}

type Pet = Dog | Cat;

interface Dog {
  meta: { type: "dog" };
  data: { name: string };
}

interface Cat {
  meta: { type: "cat" };
  data: { name: string };
}

const func = delegy<Person<Pet>, ["pet"], ["meta", "type"], [], string>(
  ["pet"],
  ["meta", "type"],
  {
    dog: (person: Person<Dog>) => `Dog: ${person.pet.data.name}`,
    cat: (person: Person<Cat>) => `Cat: ${person.pet.data.name}`,
  }
);

function info(person: Person<Pet>): string {
  return func(person);
}

console.log(
  info({
    pet: {
      meta: { type: "dog" },
      data: { name: "Rex" },
    },
  })
); // Dog: Rex
```

The type parameters that the function receives are the following:

- The type we are dealing with.
- The path to the key that we want to narrow down.
- The path to the discriminator key used to extract the subset.
- The extra parameters of the returned function.
- The return type of the returned function.

The function parameters that the functions receives are the following:

- The path to the key that we want to narrow down.
- The path to the discriminator key used to extract the subset.
- The mapper object with the keys and the corresponding functions.

## Narrow utility type

If the `Person` type was not generic we would need to use the `Narrow` utility
type as you can see here:

```ts
import { delegy, Narrow } from "delegy";

interface Person {
  pet: Pet;
}

type Pet = Dog | Cat;

interface Dog {
  meta: { type: "dog" };
  data: { name: string };
}

interface Cat {
  meta: { type: "cat" };
  data: { name: string };
}

type PersonWithDog = Narrow<Person, ["pet"], ["meta", "type"], "dog">;
type PersonWithCat = Narrow<Person, ["pet"], ["meta", "type"], "cat">;

const func = delegy<Person, ["pet"], ["meta", "type"], [], string>(
  ["pet"],
  ["meta", "type"],
  {
    dog: (person: PersonWithDog) => `Dog: ${person.pet.data.name}`,
    cat: (person: PersonWithCat) => `Cat: ${person.pet.data.name}`,
  }
);

function info(person: Person): string {
  return func(person);
}

console.log(
  info({
    pet: {
      meta: { type: "dog" },
      data: { name: "Rex" },
    },
  })
); // Dog: Rex
```
