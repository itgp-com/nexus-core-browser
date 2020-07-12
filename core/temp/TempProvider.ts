

type Cls2<T> = { new(args: any): T };

class ValueInstance2<T>{
   class: Cls2<T>;
   instance: (T|T[]);


   constructor(classArg: Cls2<T>, instanceArg: (T|T[])) {
      this.class = classArg;
      this.instance = instanceArg;
   }
};



class Provider_Args2<T>{
   class: Cls2<T>;
   instance: (T | T[]);
   children ?: Provider2<any>[];

}

class Provider2<T> {
   parent: Provider2<any>;
   children: Provider2<any>[];

   private _value: ValueInstance2<T>;

   constructor(args: Provider_Args2<T>) {
      if (args) {
         this._value = new ValueInstance2<T>(args.class, args.instance);

         if (args.children) {
            let n: number = args.children.length;
            for (let i: number = 0; i < n; i++) {
               args.children[i].parent = this;
            } // for
            this.children = args.children;
         }
      }
   }

   get type(): Cls2<T> {
      return this._value.class;
   }

   get instance(): (T | T[]) {
      return this._value.instance;
   }

   of(cls: Cls2<any>): (T | T[] | null) {
      if (!cls)
         return null;
      if (cls === this.type || isA(this.type, cls)) {
         return this.instance;
      }

      // go to the parent (if any)
      if (this.parent) {
         return this.parent.of(cls);
      }

      return null;
   }

   ofArray(cls: Cls2<any>): (T[] | null) {
      if (!cls)
         return null;
      if (cls === this.type && this.instance && Array.isArray(this.instance) ) {
         return this.instance;
      }

      // go to the parent (if any)
      if (this.parent) {
         return this.parent.ofArray(cls);
      }
      return null;
   }


   ofSimple(cls: Cls2<any>): (T | null) {
      if (!cls)
         return null;
      if (cls === this.type && this.instance && !Array.isArray(this.instance) ) {
         return this.instance;
      }

      // go to the parent (if any)
      if (this.parent) {
         return this.parent.ofSimple(cls);
      }
      return null;
   }

} // Provider


class Level0 {
   level0: string = 'Level 0';
}

class Level1 extends Level0{
   level1: string = 'Level 1';
}
class Level2 extends Level1{
   level2: string = 'Level 2';
}


let p0Simple: Provider2<Level0> = new Provider2({
                                                 class: Level0,
                                                 instance: new Level0(),
                                              });

let p0Array: Provider2<Level0> = new Provider2({
                                                class: Level0,
                                                instance: [new Level0(), new Level0()],
                                                children: [p0Simple]
                                             });

let p1Simple: Provider2<Level1> = new Provider2({
                                                 class: Level1,
                                                 instance : new Level1(),
                                                 children:[ p0Array]
                                              });

let p1Array: Provider2<Level1> = new Provider2({
                                                class: Level1,
                                                instance: [new Level1(), new Level1()],
                                                children: [p1Simple]
                                             });

let p2Simple: Provider2<Level2> = new Provider2({
                                                 class: Level2,
                                                 instance : new Level2(),
                                                 children:[p1Array]
                                              });

let p2Array: Provider2<Level2> = new Provider2({
                                                class: Level2,
                                                instance: [new Level2(), new Level2()],
                                                children:[p2Simple],
                                             });


function isA(ChildClass:any , ParentClass:any) {
   let _ = ChildClass.prototype;
   while (_ != null) {
      if (_ == ParentClass.prototype)
         return true;
      _ = _.__proto__;
   }
   return false;
}

console.log(`isA(p1Simple.type, Level2) = ${JSON.stringify(isA(p1Simple.type, Level2))}`);
console.log(`isA(p1Simple.type, Level1) = ${JSON.stringify(isA(p1Simple.type, Level1))}`);
console.log(`isA(p1Simple.type, Level0) = ${JSON.stringify(isA(p1Simple.type, Level0))}`);
console.log('\n');


console.log(`p0Simple.of(Level0) = ${JSON.stringify(p0Simple.of(Level0))}`);
console.log(`p0Simple.of(Level1) = ${JSON.stringify(p0Simple.of(Level1))}`);
console.log(`p0Simple.of(Level2) = ${JSON.stringify(p0Simple.of(Level2))}`);
console.log(`p0Simple.ofArray(Level0) = ${JSON.stringify(p0Simple.ofArray(Level0))}`);
console.log(`p0Simple.ofArray(Level1) = ${JSON.stringify(p0Simple.ofArray(Level1))}`);
console.log(`p0Simple.ofArray(Level2) = ${JSON.stringify(p0Simple.ofArray(Level2))}`);
console.log(`p0Simple.ofSimple(Level0) = ${JSON.stringify(p0Simple.ofSimple(Level0))}`);
console.log(`p0Simple.ofSimple(Level1) = ${JSON.stringify(p0Simple.ofSimple(Level1))}`);
console.log(`p0Simple.ofSimple(Level2) = ${JSON.stringify(p0Simple.ofSimple(Level2))}`);
console.log('\n');

console.log(`p1Simple.of(Level0) = ${JSON.stringify(p1Simple.of(Level0))}`);
console.log(`p1Simple.of(Level1) = ${JSON.stringify(p1Simple.of(Level1))}`);
console.log(`p1Simple.of(Level2) = ${JSON.stringify(p1Simple.of(Level2))}`);
console.log(`p0Simple.ofArray(Level0) = ${JSON.stringify(p0Simple.ofArray(Level0))}`);
console.log(`p0Simple.ofArray(Level1) = ${JSON.stringify(p0Simple.ofArray(Level1))}`);
console.log(`p0Simple.ofArray(Level2) = ${JSON.stringify(p0Simple.ofArray(Level2))}`);
console.log(`p0Simple.ofSimple(Level0) = ${JSON.stringify(p0Simple.ofSimple(Level0))}`);
console.log(`p0Simple.ofSimple(Level1) = ${JSON.stringify(p0Simple.ofSimple(Level1))}`);
console.log(`p0Simple.ofSimple(Level2) = ${JSON.stringify(p0Simple.ofSimple(Level2))}`);
console.log('\n');


console.log(`p2Simple.of(Level0) = ${JSON.stringify(p2Simple.of(Level0))}`);
console.log(`p2Simple.of(Level1) = ${JSON.stringify(p2Simple.of(Level1))}`);
console.log(`p2Simple.of(Level2) = ${JSON.stringify(p2Simple.of(Level2))}`);
console.log('\n');


console.log(`p0Simple.of(Level0) = ${JSON.stringify(p0Simple.of(Level0))}`);
console.log(`p0Simple.of(Level1) = ${JSON.stringify(p0Simple.of(Level1))}`);
console.log(`p0Simple.of(Level2) = ${JSON.stringify(p0Simple.of(Level2))}`);
console.log('\n');
console.log('----------------------------------');
console.log('\n');

console.log(`p0Array.of(Level0) = ${JSON.stringify(p0Array.of(Level0))}`);
console.log(`p0Array.of(Level1) = ${JSON.stringify(p0Array.of(Level1))}`);
console.log(`p0Array.of(Level2) = ${JSON.stringify(p0Array.of(Level2))}`);
console.log('\n');

console.log(`p0Array.ofArray(Level0) = ${JSON.stringify(p0Array.ofArray(Level0))}`);
console.log(`p0Array.ofArray(Level1) = ${JSON.stringify(p0Array.ofArray(Level1))}`);
console.log(`p0Array.ofArray(Level2) = ${JSON.stringify(p0Array.ofArray(Level2))}`);
console.log('\n');


console.log(`p1Array.of(Level0) = ${JSON.stringify(p1Array.of(Level0))}`);
console.log(`p1Array.of(Level1) = ${JSON.stringify(p1Array.of(Level1))}`);
console.log(`p1Array.of(Level2) = ${JSON.stringify(p1Array.of(Level2))}`);
console.log('\n');

console.log(`p1Array.ofArray(Level0) = ${JSON.stringify(p1Array.ofArray(Level0))}`);
console.log(`p1Array.ofArray(Level1) = ${JSON.stringify(p1Array.ofArray(Level1))}`);
console.log(`p1Array.ofArray(Level2) = ${JSON.stringify(p1Array.ofArray(Level2))}`);
console.log('\n');