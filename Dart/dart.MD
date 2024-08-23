# DART



[TOC]



# Variable

> 数字（就像 Dart 中的其他所有东西一样）都是对象

类型推断

```dart
// 变量 name 的类型被推断为 String
var name = 'Bob';
// 显式声明
String name = 'Bob';
```

一个对象不受限于单一类型，可以指定为 `Object` 类型（或在必要时使用 `dynamic`）。

```dart
Object name = 'Bob';
```

## 空安全

1. 可空

```dart
String? name  // Nullable type. Can be `null` or string.

String name   // Non-nullable type. Cannot be `null` but can be string.
```

2. 必须在使用变量之前对其进行初始化，Dart **不会为非可空类型设置初始值**，它强制要求你设置初始值。
3. 你不能在可空类型的表达式上访问属性或调用方法（除了 `hashCode` 或 `toString()`）

## 默认值

具有可空类型的未初始化变量的初始值为 `null` 

*顶级变量和类变量是延迟初始化的，它们会在第一次被使用时再初始化*

## 延迟初始化变量

`late` 修饰符有两种用法：

- 声明一个非空变量，但不在声明时初始化。

  > 通常 Dart 的语义分析可以检测非空变量在使用之前是否被赋值，但有时会分析失败。常见的两种情况是在**分析顶级变量和实例变量时**，Dart 通常无法确定它们是否已设值，因此不会尝试分析。

  ```dart
  // 顶级变量
  late int count;
  
  void main() {
    count = 1;
    print(count); // 1
  }
  ```

- 延迟初始化一个变量

  - （Dart 推断）可能不需要该变量，并且初始化它的开销很高。
  - 你正在初始化一个实例变量，它的初始化方法需要调用 `this`。

  ```dart
  //场景1 
  // 如果 temperature 变量从未被使用，则 readThermometer() 这个开销较大的函数也永远不会被调用：
  late String temperature = readThermometer(); // Lazily initialized.
  
  
  // 场景2 对象尚未初始化 调用了对象方法
  class Rectangle {
    final double width;
    final double height;
  
    // 只有在真正使用的时候才会初始化（不加 late 会因为
    late final double area = _calculateArea();
    
    // ERROR: 这是因为 _calculateArea 是一个未绑定的实例方法，它需要在对象被创建之后才能被调用
    // final double area = _calculateArea();
  
    Rectangle(this.width, this.height);
  
    double _calculateArea() {
      print('Calculating area...');
      return width * height;
    }
  }
  
  void main() {
    // 实例化一个 Rectangle 对象
    Rectangle rect = Rectangle(10, 5);
  
    // 此时 area 尚未被计算，因为它是 late 初始化的
    print('Before accessing area');
  
    // 第一次访问 area 时才会计算
    print('Area: ${rect.area}');
  
    // 后续访问不再重复计算
    print('Area again: ${rect.area}');
  }
  ```

  ## 终值 (`final`) 和常量 (`const`)

> [实例变量](https://dart.cn/language/classes#instance-variables) 可以是 `final` 但不能是 `const`。

一个 final 变量只能设置一次，`const` 变量是编译时常量。（`const` 常量隐式包含了 `final`。）

`final` VS `const`

`final` 变量在**运行时**被初始化

`const` 变量在**编译时**就被初始化且是编译时常量



> 虽然 `final` 对象不能被修改，但**它的字段可能可以被更改**。相比之下，`const` 对象及其字段不能被更改：它们是 **不可变的**。

```dart
  final Map<String, Object> map = {
    "name": 'john',
  };
  // OK
  map['name'] = 'jake';
  
  
  const Map<String, Object> map = {
    "name": 'john',
  };
  // ERROR
  map['name'] = 'jake';
```



# Operator

| cascade | `..`  `?..` |
| ------- | ----------- |

> 严格来说，级联的“双点”表示法不是运算符。它只是 Dart 语法的一部分。

cascade 操作符 `..` 可以用来对一个对象连续调用多个方法，而不需要重复地引用该对象。cascade 操作符 `..` 后面跟的是一个表达式，该表达式返回一个对象，然后对返回的对象连续调用多个方法。

```dart
List<int> list = [3, 2, 1];
list..remove(2)..sort();
print(list); // 输出 [1, 3]


var paint = Paint()
  ..color = Colors.black
  ..strokeCap = StrokeCap.round
  ..strokeWidth = 5.0;
// equivalent to 
var paint = Paint();
paint.color = Colors.black;
paint.strokeCap = StrokeCap.round;
paint.strokeWidth = 5.0;
```

`?..` 操作符是可选 cascade 操作符，它与 `..` 操作符类似，但是当左侧的对象为 null 时，它不会抛出异常，而是直接返回 null。

> 对于采用两个操作数的运算符，**最左边的操作数决定使用哪种方法**。
>
> 例如，如果您有一个`Vector`对象和一个`Point`对象，则`aVector + aPoint`使用`Vector`加法 ( `+` )。

```dart
querySelector('#confirm') // Get an object.
  ?..text = 'Confirm' // Use its members.
  ..classes.add('important')
  ..onClick.listen((e) => window.alert('Confirmed!'))
  ..scrollIntoView();

// equivalent to 
var button = querySelector('#confirm');
button?.text = 'Confirm';
button?.classes.add('important');
button?.onClick.listen((e) => window.alert('Confirmed!'));
button?.scrollIntoView();
```



```dart
// 嵌套级联
final addressBook = (AddressBookBuilder()
      ..name = 'jenny'
      ..email = 'jenny@example.com'
      ..phone = (PhoneNumberBuilder()
            ..number = '415-555-0100'
            ..label = 'home')
          .build())
    .build();
```

在**返回实际对象的函数上构建级联时要小心**。例如，以下代码会失败：

```
var sb = StringBuffer();
sb.write('foo')
  ..write('bar'); // Error: method 'write' isn't defined for 'void'.
```

`sb.write()`调用返回 void，并且您无法在`void`上构造级联。





| Operator | Meaning                                                      |
| -------- | ------------------------------------------------------------ |
| `as`     | 类型转换（也用于指定[库前缀](https://dart.cn/language/libraries#specifying-a-library-prefix): `import xxx as xxx`） |
| `is`     | 如果对象具有指定类型，则为 True                              |
| `is!`    | (IS NOT) 如果对象没有指定的类型，则为 True                   |

如果`obj`实现了`T`指定的接口，则`obj is T`的结果为 true。例如， `obj is Object?`总是正确的。

如果您不确定该对象的类型为`T` ，请在使用该对象之前使用`is T`检查类型。

```
if (employee is Person) {
  // Type check
  employee.firstName = 'Bob';
}
```





| `~/` | Divide, returning an integer result (除法，返回整数结果) |
| ---- | -------------------------------------------------------- |

```dart
assert(5 ~/ 2 == 2); // Result is an int
```





要测试两个对象 x 和 y 是否表示同一事物，请使用`==`运算符。(在极少数情况下，您需要知道两个对象是否是完全相同的对象，请使用[identical](https://api.dart.cn/stable/dart-core/identical.html)函数。)

以下是`==`运算符的工作原理：

1. 都为 null 返回 true，一个为 null，返回 false

2. 将 y 作为参数 调用 x 的 == 方法    （即 `x.==(y)`)

   ```dart
   class MyClass {
     int value;
   
     MyClass(this.value);
   
     bool operator ==(Object other) {
       print('----- call MyClass == ----- ${other is OtherClass}');
       return other is OtherClass && value == other.value;
     }
   }
   
   class OtherClass {
     int value;
   
     OtherClass(this.value);
   
     bool operator ==(Object other) {
       print('----- call OtherClass == -----');
       return other is MyClass && value == other.value;
     }
   }
   
   void main() {
     MyClass myInstance = MyClass(1);
     OtherClass otherInstance = OtherClass(1);
   
     /**
      * ----- call MyClass == -----
      * true
     **/
     print(myInstance == otherInstance);
   
     /**
      * ----- call MyClass == -----
      * true
     **/
     print(otherInstance == myInstance);
   }
   
   
   ```



仅在分配的变量为 null 时进行分配，请使用`??=`运算符

```dart
// Assign value to a
a = value;
// Assign value to b if b is null; otherwise, b stays the same
b ??= value;
```







| `>>>` | Unsigned shift right 无符号右移 |
| ----- | ------------------------------- |

```dart
final value = 0x22;
assert((value >>> 4) == 0x02); // Unsigned shift right
assert((-value >>> 4) > 0); // Unsigned shift right
```

```
有符号右移操作前的值：1111 1111 1111 1111（二进制，-1 十进制）
有符号右移 1 位后的值：1111 1111 1111 1111（二进制，-1 十进制）
无符号右移 1 位后的值：0111 1111 1111 1111（二进制，2147483647 十进制）
```





| spread ([See note](https://dart.cn/language/operators/#spread-operators)) | `...`  `...?` |
| ------------------------------------------------------------ | ------------- |

如果扩展运算符右侧的表达式可能为 null，则可以使用支持 null 的扩展运算符 ( `...?` ) 来避免异常：

```
var list2 = [0, ...?list];
assert(list2.length == 1);
```



| `[]`  | Subscript access             | Represents a call to the overridable `[]` operator; example: `fooList[1]` passes the int `1` to `fooList` to access the element at index `1`<br /><br /> |
| ----- | ---------------------------- | ------------------------------------------------------------ |
| `?[]` | Conditional subscript access | 与`[]`类似，但最左边的操作数可以为 null；示例： `fooList?[1]`将 int `1`传递给`fooList`以访问索引`1`处的元素，除非`fooList`为 null（在这种情况下表达式计算结果为 null） |

> Map 只能用 [] 获取值





# Comments

## Documentation comments

文档注释是以`///`或`/**`开头的多行或单行注释。在连续行上使用`///`与多行文档注释具有相同的效果。

```dart
class Food {}

class Activity {}


/// A domesticated South American camelid (Lama glama).
///
/// Andean cultures have used llamas as meat and pack
/// animals since pre-Hispanic times.
///
/// Just like any other animal, llamas need to eat,
/// so don't forget to [feed] them some [Food].
class Llama {
  String? name;

  /// Feeds your llama [food].
  ///
  /// The typical llama eats one bale of hay per week.
  void feed(Food food) {
    // ...
  }

  /// Exercises your llama with an [activity] for
  /// [timeLimit] minutes.
  void exercise(Activity activity, int timeLimit) {
    // ...
  }
}
```

在类的生成文档中， `[feed]`成为`feed`方法的文档链接， `[Food]`成为`Food`类的文档链接。

要解析 Dart 代码并生成 HTML 文档，可以使用 Dart 的文档生成工具[`dart doc`](https://dart.cn/tools/dart-doc) 。有关生成文档的示例，请参阅[Dart API 文档。](https://api.dart.cn/stable)有关如何构建评论的建议，请参阅[Effective Dart：文档。](https://dart.cn/effective-dart/documentation)



# Metadata

使用元数据提供有关代码的附加信息。元数据注释以字符`@`开头，后跟对编译时常量（例如`deprecated` ）的引用或对常量构造函数的调用。

> 元数据注释用于向代码提供附加信息，这些信息在编译时可以使用，但在运行时不会影响代码的执行

```dart
class Todo {
  final String who;
  final String what;

  const Todo(this.who, this.what);
}

// 对常量构造函数的调用
@Todo('Dash', 'Implement this function')
void doSomething() {
  print('Do something');
}
```

所有 Dart 代码都可以使用四个注释： 

- [`@Deprecated`](https://api.dart.cn/stable/dart-core/Deprecated-class.html) 需要指定消息 （见下方例子)
- [`@deprecated`](https://api.dart.cn/stable/dart-core/Deprecated-class.html) 不需要指定消息 (见下方例子)
-  [`@override`](https://api.dart.cn/stable/dart-core/override-constant.html)
- [`@pragma`](https://api.dart.cn/stable/dart-core/pragma-class.html)

```dart
class Television {
  /// Use [turnOn] to turn the power on instead.
  @Deprecated('Use turnOn instead')
  void activate() {
    turnOn();
  }
  
  @deprecated
  void xxx () {}

  /// Turns the TV's power on.
  void turnOn() {...}
  // ···
}
```





# Libraries & imports

`import`和`library`指令可以帮助您创建模块化且可共享的代码库。库不仅提供 API，而且还是一个隐私单位：**以下划线 ( `_` ) 开头的标识符仅在库内部可见**。*每个 Dart 文件（及其部分）都是一个[库](https://dart.cn/tools/pub/glossary#library)*，即使它不使用[`library`](https://dart.cn/language/libraries/#library-directive)指令。

库可以使用[包(packages)](https://dart.cn/guides/packages)来分发。

## Using libraries

```dart
import 'dart:html';
```

- 内置库：特殊的`dart:`scheme
- 其它：
  - 文件系统路径
  - `package:`scheme （指定由包管理器（例如 pub 工具）提供的库）

## Specifying a library prefix

> 标识符冲突

```dart
import 'package:lib1/lib1.dart';
import 'package:lib2/lib2.dart' as lib2;
// Uses Element from lib1.
Element element1 = Element();

// Uses Element from lib2.
lib2.Element element2 = lib2.Element();
```

## Importing only part of a library 

```dart
// Import only foo.
import 'package:lib1/lib1.dart' show foo;

// Import all names EXCEPT foo.
import 'package:lib2/lib2.dart' hide foo;
```

## Lazily loading a library

按需加载库

`dart`工具**不支持除 Web 之外的目标的延迟加载**。如果您正在构建 Flutter 应用程序，请参阅 **Flutter[延迟组件](https://docs.flutter.cn/perf/deferred-components)指南** 中的延迟加载实现。

要延迟加载库，请首先使用`deferred as`导入它。

```dart
import 'package:greetings/hello.dart' deferred as hello;
```

当您需要该库时，请使用该库的标识符调用`loadLibrary()` 

```dart
Future<void> greet() async {
  await hello.loadLibrary();
  hello.printGreeting();
}
```

您可以在库上**多次调用`loadLibrary()`** ，不会出现问题。**该库仅加载一次**。

注意点：

- 延迟库的类型也是延迟导入（建议使用公共文件导出以供两者使用）
- Dart 隐式地将`loadLibrary()`插入到您使用`deferred as namespace`定义的命名空间中。 `loadLibrary()`函数返回一个[`Future`](https://dart.cn/libraries/dart-async#future) 。

## The `library` directive

要指定库级[文档注释](https://dart.cn/effective-dart/documentation#consider-writing-a-library-level-doc-comment)或[元数据注释](https://dart.cn/language/metadata)，请将它们附加到文件开头的`library`声明中。

```dart
/// A really great test library.
@TestOn('browser')
library;
```



# Built-in types

- [Numbers](https://dart.cn/language/built-in-types/#numbers) (`int`, `double`)
- [Strings](https://dart.cn/language/built-in-types/#strings) (`String`)
- [Booleans](https://dart.cn/language/built-in-types/#booleans) (`bool`)
- [Records](https://dart.cn/language/records) (`(value1, value2)`)
- [Lists](https://dart.cn/language/collections#lists) (`List`, also known as *arrays*)
- [Sets](https://dart.cn/language/collections#sets) (`Set`)
- [Maps](https://dart.cn/language/collections#maps) (`Map`)
- [Runes](https://dart.cn/language/built-in-types/#runes-and-grapheme-clusters) (`Runes`; often replaced by the `characters` API)
- [Symbols](https://dart.cn/language/built-in-types/#symbols) (`Symbol`)
- The value `null` (`Null`)



其他一些类型在 Dart 语言中也具有特殊作用：

- `Object` ：除`Null`之外的所有 Dart 类的超类。
- `Enum` ：所有枚举的超类。
- `Iterable` ：用于[for-in 循环](https://dart.cn/libraries/dart-core#iteration)和同步[生成器函数](https://dart.cn/language/functions#generators)。
- `Never` ：表示表达式永远无法成功完成求值。最常用于总是抛出异常的函数。
- `dynamic` ：表示您要禁用静态检查。通常你应该使用`Object`还是`Object?`。
- `void` ：表示从未使用过某个值。通常用作返回类型。



`int`: 整数值不大于 64 位，[具体取决于平台](https://dart.cn/guides/language/numbers)

[`double`](https://api.dart.cn/stable/dart-core/double-class.html): 64 位（双精度）浮点数，由 IEEE 754 标准指定

您还可以将变量声明为 `num`。如果这样做，变量可以同时具有整数值和双精度值。

```dart
num x = 1; // x can have both int and double values
x += 2.5;
```

必要时，整数字面量会自动转换为双精度数：

```dart
double z = 1; // Equivalent to double z = 1.0.
```

```dart
// String -> int
var one = int.parse('1');
assert(one == 1);

// String -> double
var onePointOne = double.parse('1.1');
assert(onePointOne == 1.1);

// int -> String
String oneAsString = 1.toString();
assert(oneAsString == '1');

// double -> String
String piAsString = 3.14159.toStringAsFixed(2);
assert(piAsString == '3.14');
```

## Strings

可以使用单引号或双引号来创建字符串

```dart
var s1 = 'Single quotes work well for string literals.';
var s2 = "Double quotes work just as well.";
var s3 = 'It\'s easy to escape the string delimiter.';
var s4 = "It's even easier to use the other delimiter.";
```

您可以使用`${` *`expression`* `}`将表达式的值放入字符串中。如果表达式是标识符，则可以省略`{}` 。

*为了获取与某个对象对应的字符串，Dart 调用该对象的`toString()`方法*。

```dart
var s = 'string interpolation';

// 等效于 ${s}
assert('Dart has $s'); // Dart has string interpolation
assert('That deserves all caps. '
        '${s.toUpperCase()}' ==
    'That deserves all caps. '
        'STRING INTERPOLATION');
```

您可以使用相邻的字符串文字或`+`运算符连接字符串：

```dart
var s1 = 'a '
    'b'
assert(s1 == 'a b');

var s2 = 'a' + ' ' + 'b';
assert(s2 == 'a b');
```

要创建多行字符串，请使用带有单引号或双引号的三引号：

```dart
var s1 = '''
You can create
multi-line strings like this one.
''';

var s2 = """This is also a
multi-line string.""";
```

You can create a "raw" string by prefixing it with `r`:

```dart
var s = r'In a raw string, not even \n gets special treatment.';
```

## Boolean

Dart 的类型安全意味着您不能使用`if ( *nonbooleanValue* )`或`assert ( *nonbooleanValue* )`等代码。相反，显式检查值，如下所示：

```dart
// Check for an empty string.
var fullName = '';
assert(fullName.isEmpty);

// Check for zero.
var hitPoints = 0;
assert(hitPoints == 0);

// ... 
```

## Runes and grapheme clusters (符文和字素簇)

在 Dart 中，[符文](https://api.dart.cn/stable/dart-core/Runes-class.html)公开字符串的 Unicode 代码点。您可以使用[字符包](https://pub-web.flutter-io.cn/packages/characters)来查看或操作用户感知的字符，也称为[Unicode（扩展）字素簇。](https://unicode.org/reports/tr29/#Grapheme_Cluster_Boundaries)

如果需要读取或写入单个 Unicode 字符，请使用字符包在 String 上定义的`characters` getter。返回的[`Characters`](https://pub-web.flutter-io.cn/documentation/characters/latest/characters/Characters-class.html)对象是作为字素簇序列的字符串。以下是使用字符 API 的示例：

```dart
import 'package:characters/characters.dart';

void main() {
  var hi = 'Hi 🇩🇰';
  print(hi);
  print('The end of the string: ${hi.substring(hi.length - 1)}');
  print('The last character: ${hi.characters.last}');
}
```

## Symbols

要获取标识符的符号，请使用符号文字，即`#`后跟标识符：

```dart
#radix
#bar
```

Symbols literals 是编译时常量。



# Records

匿名的、不可变的聚合类型

- 固定大小的
- 异构
- 类型化

## Record syntax

comma-delimited lists of named or positional fields

以**逗号分隔**的  命名或位置字段 列表

```dart
var record = ('first', a: 2, b: true, 'last');
```

```dart
(int, int) swap((int, int) record) {
  var (a, b) = record;
  return (b, a);
}
```

命名字段在大括号内，**位于所有位置字段之后**

```dart
// Record type annotation in a variable declaration:
({int a, bool b}) record;

// Initialize it with a record expression:
record = (a: 123, b: true);
```



The names of named fields in a record type are part of the [record's type definition](https://dart.cn/language/records/#record-types), or its *shape*. Two records with named fields with different names have different types:
记录类型中命名字段的名称是[记录类型定义](https://dart.cn/language/records/#record-types)或其*形状*的一部分。具有不同名称的命名字段的两条记录具有不同的类型：

```dart
({int a, int b}) recordAB = (a: 1, b: 2);
({int x, int y}) recordXY = (x: 3, y: 4);

// Compile error! These records don't have the same type.
// recordAB = recordXY;

(int x, int y, int z) point = (1, 2, 3);
(int r, int g, int b) color = (1, 2, 3);
print(point == color); // Prints 'true'.
point = color // OK

({int x, int y, int z}) point = (x: 1, y: 2, z: 3);
({int r, int g, int b}) color = (r: 1, g: 2, b: 3);
print(point == color); // Prints 'false'. Lint: Equals on unrelated types.
point = color // OK

```

在记录类型注释中，您还可以命名*位置*字段，但这些名称纯粹用于文档，不会影响记录的类型：

```dart
// a b只是用于注释，可以省略
(int a, int b) recordAB = (1, 2);
(int x, int y) recordXY = (3, 4);

recordAB = recordXY; // OK.
```

这类似于函数声明或函数 typedef 中的位置参数可以具有名称，但这些名称不会影响函数的签名。



您还可以使用其[命名 fields](https://dart.cn/language/records/#record-fields)和冒号`:`语法来解构记录

```dart
({String name, int age}) userInfo(Map<String, dynamic> json)
// ···
// Destructures using a record pattern with named fields:
final (:name, :age) = userInfo(json);
```





# Collections

## Lists

## Sets

要创建空集，请使用前面带有类型参数的`{}` ，或将`{}`分配给`Set`类型的变量：

```dart
var names = <String>{};
// Set<String> names = {}; // This works, too.
// var names = {}; // Creates a map, not a set.
```

方法

- `add`
- `addAll()`

```dart
var strings = ['1', '2'];
var elements = <String>{};
elements.add('fluorine');
elements.addAll(strings);

// 使用.length获取集合中的项目数
assert(elements.length == 3);
```

## Maps 

```dart
var gifts = {'first': 'partridge'};

// 使用下标赋值运算符 ( `[]=` ) 将新的键值对添加到现有映射：
gifts['fourth'] = 'calling birds'; // Add a key-value pair

// 使用下标运算符 ( `[]` ) 从映射中检索值：
assert(gifts['first'] == 'partridge');

// 如果您查找地图中不存在的键，则会得到`null`作为返回：
assert(gifts['fifth'] == null);

// 使用`.length`获取映射中键值对的数量：
gifts['fourth'] = 'calling birds';
assert(gifts.length == 2);
```



## Operators

### Spread operators

```dart
var list = [1, 2, 3];
var list2 = [0, ...list];
assert(list2.length == 4);

// 如果扩展运算符右侧的表达式可能为 null，则可以使用支持 null 的扩展运算符 ( ...? ) 来避免异常：
var list2 = [0, ...?list];
assert(list2.length == 1);


```

### Control-flow operators

```dart
var nav = ['Home', 'Furniture', 'Plants', if (promoActive) 'Outlet'];

// if-case
// Dart if语句支持case子句后跟模式
var nav = ['Home', 'Furniture', 'Plants', if (login case 'Manager') 'Inventory'];

// 以下是在将列表项添加到另一个列表之前使用集合来操作列表项的示例：
var listOfInts = [1, 2, 3];
var listOfStrings = ['#0', for (var i in listOfInts) '#$i'];
assert(listOfStrings[1] == '#1');
```



# [泛型 (Generics) ](https://dart.cn/language/generics)

## Restricting the parameterized type

一个常见的用例是通过使其成为`Object`的子类型（而不是默认的[`Object?`](https://dart.cn/null-safety/understanding-null-safety#top-and-bottom) ）来确保类型不可为 null。

```dart
class Foo<T extends Object> {
  // Any type provided to Foo for T must be non-nullable.
}
```







# Typedefs

类型别名（type alias）类似 TS 中的 `type`

```dart
typedef IntList = List<int>;
IntList il = [1, 2, 3];
```

**可以有类型参数**：

```dart
typedef ListMapper<X> = Map<X, List<X>>;
Map<String, List<String>> m1 = {}; // Verbose.
ListMapper<String> m2 = {}; // Same thing but shorter and clearer.
```

在大多数情况下，我们建议使用[内联函数类型](https://dart.cn/effective-dart/design#prefer-inline-function-types-over-typedefs)而不是函数的 typedef。然而，函数 typedef 仍然有用：

```dart
typedef Compare<T> = int Function(T a, T b);

int sort(int a, int b) => a - b;

void main() {
  assert(sort is Compare<int>); // True!
}
```







# Patterns

一般来说，模式可以**匹配**值、**解构**值或两者兼而有之，具体取决于模式的上下文和形状

首先，*模式匹配*允许您检查给定值是否：

- Has a certain shape. 具有一定的形状
  - 这通常涉及到对数据结构的内部组成进行检查）
- Is a certain constant. 是一定的常数
- Is equal to something else. 等于其他东西
- Has a certain type. 有一定的类型 
  - 是否属于特定的类型，这与检查形状不同，因为它关注的是值的类型，而不是值的内部结构。例如，你可以检查一个值是否是一个字符串或一个整数，而不关心它的具体内容或结构。

### 

您可以在解构模式中嵌套[任何类型的模式](https://dart.cn/language/pattern-types)。例如，此 case 模式匹配并解构第一个元素为`'a'`或`'b'`的二元素列表：

```dart
switch (list) {
  case ['a' || 'b', var c]:
    print(c);
}
```



## Places patterns can appear 

- Local variable [declarations](https://dart.cn/language/patterns/#variable-declaration) and [assignments](https://dart.cn/language/patterns/#variable-assignment)
- [for and for-in loops](https://dart.cn/language/loops#for-loops)
- [if-case](https://dart.cn/language/branches#if-case) and [switch-case](https://dart.cn/language/branches#switch-statements)
- Control flow in [collection literals](https://dart.cn/language/collections#control-flow-operators)



### Variable declaration

```dart
// Declares new variables a, b, and c.
var (a, [b, c]) = ('str', [1, 2]);
```

### Variable assignment

```dart
var (a, b) = ('left', 'right');
(b, a) = (a, b); // Swap.
print('$a $b'); // Prints "right left".
```

### Switch 语句和表达式

每个 case 子句都包含一个模式。这适用于[switch 语句](https://dart.cn/language/branches#switch-statements)和[表达式](https://dart.cn/language/branches#switch-expressions)，以及[if-case 语句](https://dart.cn/language/branches#if-case)。您可以在案例中使用[任何类型的图案](https://dart.cn/language/pattern-types)。

```dart
switch (obj) {
  // Matches if 1 == obj.
  case 1:
    print('one');

  // Matches if the value of obj is between the
  // constant values of 'first' and 'last'.
  case >= first && <= last:
    print('in range');

  // Matches if obj is a record with two fields,
  // then assigns the fields to 'a' and 'b'.
  case (var a, var b):
    print('a = $a, b = $b');

  default:
}
```

[逻辑或模式](https://dart.cn/language/pattern-types#logical-or)对于让多个 case 在 switch 表达式或语句中共享一个主体非常有用：

```dart
var isPrimary = switch (color) {
  Color.red || Color.yellow || Color.blue => true,
  _ => false
};



sealed class Shape {}

class Square implements Shape {
  final double length;
  Square(this.length);
}

class Circle implements Shape {
  final double radius;
  Circle(this.radius);
}

double calculateArea(Shape shape) => switch (shape) {
    Square(length: var l) => l * l,
    Circle(radius: var r) => math.pi * r * r
};

```

[Guard clauses](https://dart.cn/language/branches#guard-clause) evaluate an arbitrary condition as part of a case, **without exiting the switch if the condition is false** (like using an `if` statement in the case body would cause).

>  注：当 when 不满足时，跳过当前 case 且不退出 switch

```dart
// Switch statement:
switch (something) {
  case somePattern when some || boolean || expression:
    //             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Guard clause.
    body;
}

// Switch expression:
var value = switch (something) {
  somePattern when some || boolean || expression => body,
  //               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Guard clause.
}

// If-case statement:
if (something case somePattern when some || boolean || expression) {
  //                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Guard clause.
  body;
}
```

### For and for-in loops for 

```dart
Map<String, int> hist = {
  'a': 23,
  'b': 100,
};

for (var MapEntry(key: key, value: count) in hist.entries) {
  print('$key occurred $count times');
}

// 简化
for (var MapEntry(:key, value: count) in hist.entries) {
  print('$key occurred $count times');
}
```

## Use cases for patterns

- *When and why* you might want to use patterns.
  您*何时以及为何*需要使用模式。
- What kinds of problems they solve.
  他们解决什么样的问题。
- Which idioms they best suit.
  它们最适合哪些成语。

### Destructuring multiple returns

```dart
(String name, int age) userInfo(Map<String, dynamic> json) {
  return (json['name'] as String, json['age'] as int);
}

final json = <String, dynamic>{
  'name': 'Dash',
  'age': 10,
  'color': 'blue',
};

// Destructures using a record pattern with positional fields:
var (name, age) = userInfo(json);

/* Equivalent to:
  var info = userInfo(json);
  var name = info.$1;
  var age  = info.$2;
*/



// To destructure a record with named fields using a pattern:
final (:name, :age) =
    getData(); // For example, return (name: 'doug', age: 25);
    
    
```

### Destructuring class instances

[Object patterns](https://dart.cn/language/pattern-types#object) match against named object types, allowing you to destructure their data using **the getters the object's class already exposes**.
[对象模式](https://dart.cn/language/pattern-types#object)与命名对象类型相匹配，允许您使用对象**类已经公开的 getter** 来解构其数据。

```dart
final Foo myFoo = Foo(one: 'one', two: 2);
var Foo(:one, :two) = myFoo;
print('one $one, two $two');
```

### Validating incoming JSON

```dart
// 但数据通常来自外部来源，例如通过网络。您需要先对其进行验证以确认其结构。
// 如果没有模式，验证就会很冗长：
if (json is Map<String, Object?> &&
    json.length == 1 &&
    json.containsKey('user')) {
  var user = json['user'];
  if (user is List<Object> &&
      user.length == 2 &&
      user[0] is String &&
      user[1] is int) {
    var name = user[0] as String;
    var age = user[1] as int;
    print('User $name is $age years old.');
  }
}

// equivalent to
if (json case {'user': [String name, int age]}) {
  print('User $name is $age years old.');
}
```

# Pattern types

## Logical-or

`subpattern1 || subpattern2`

```dart
var isPrimary = switch (color) {
  Color.red || Color.yellow || Color.blue => true,
  _ => false
};
```

## Logical-and

`subpattern1 && subpattern2`

```dart
switch ((1, 2)) {
  // Error, both subpatterns attempt to bind 'b'.
  case (var a, var b) && (var b, var c): // ...
}
```

## Relational

```
== expression
< expression
```

```dart
String asciiCharType(int char) {
  const space = 32;
  const zero = 48;
  const nine = 57;

  return switch (char) {
    < space => 'control',
    == space => 'space',
    > space && < zero => 'punctuation',
    >= zero && <= nine => 'digit',
    // deafult 
    _ => ''
  };
}
```

## Cast 

`foo as String`

A cast pattern lets you **insert a [type cast](https://dart.cn/language/operators#type-test-operators) in the middle of destructuring**, before passing the value to another subpattern:

```dart
(num, Object) record = (1, 's');
var (i as int, s as String) = record;
```

## Null-check

`subpattern?`

To **treat `null` values as match failures without throwing**, use the null-check pattern.

```dart
String? maybeString = 'nullable with base type String';
switch (maybeString) {
  case var s?:
  // 's' has type non-nullable String here.
}
```

To match when the value *is* null, use the [constant pattern](https://dart.cn/language/pattern-types/#constant) `null`

## Null-assert

`subpattern!`

Null-assert patterns match first if the object is not null, then on the value. They **permit non-null values to flow through, but [throw](https://dart.cn/language/error-handling#throw) if the matched value is null**.

```dart
List<String?> row = ['user', null];
switch (row) {
  // this will THROW ERROR
  case ['user', var name!]: // ...
  // 'name' is a non-nullable string here.
}
```

要从变量声明模式中消除`null`值，请使用空断言模式：

```dart
(int?, int?) position = (2, 3);

var (x!, y!) = position;
```

## Constant

`123`, `null`, `'string'`, `math.pi`, `SomeClass.constant`, `const Thing(1, 2)`,` const (1 + 2)`

```dart
switch (number) {
  // Matches if 1 == number.
  case 1: // ...
}
```

- Number literals (`123`, `45.56`)
  数字文字 ( `123` , `45.56` )
- Boolean literals (`true`)
  布尔文字 ( `true` )
- String literals (`'string'`)
  字符串文字 ( `'string'` )
- Named constants (`someConstant`, `math.pi`, `double.infinity`)
  命名常量（ `someConstant` 、 `math.pi` 、 `double.infinity` ）
- Constant constructors (`const Point(0, 0)`)
  常量构造函数 ( `const Point(0, 0)` )
- Constant collection literals (`const []`, `const {1, 2}`)
  常量集合文字 ( `const []` , `const {1, 2}` )

更复杂的常量表达式必须加括号并以`const` 为前缀: ( `const (1 + 2)` )

```dart
// List or map pattern:
case [a, b]: // ...

// List or map literal:
case const [a, b]: // ...
```

## Parenthesized (带括号的)

- control [pattern precedence](https://dart.cn/language/pattern-types/#pattern-precedence) 

- insert a lower-precedence pattern where a higher precedence one is expected

```dart
var x = true;
var y = true;
var z = false;

// ...
x || y => 'matches true',

// `x || y && z` is the same thing as `x || (y && z)`.
x || y && z => 'matches true',
x || (y && z) => 'matches true',

(x || y) && z => 'matches nothing',
// ...
```

## List 

`[subpattern1, subpattern2]`

### Rest element

```dart
var [a, b, ..., c, d] = [1, 2, 3, 4, 5, 6, 7];
// Prints "1 2 6 7".
print('$a $b $c $d');

var [a, b, ...rest, c, d] = [1, 2, 3, 4, 5, 6, 7];
// Prints "1 2 [3, 4, 5] 6 7".
print('$a $b $rest $c $d');
```

## Map 

`{"key": subpattern1, someConst: subpattern2}`

Map patterns **don't require the pattern to match the entire map**. A map pattern ignores any keys that the map contains that aren't matched by the pattern.

```dart
Map<String, dynamic> map = {
  'name': 'jack',
  'age': 25,
};

switch (map) {
  // FAIL
  case {
    'name': String,
    'age': num,
  }:
    print('name is a string');  
    // OK
  case {
    'name': String _,
    'age': num _,
  }:
    print('name is a string');
    // OK
  case {
    'name': String _,
  }:
    print('name is a string');

}

// OK
if (map
    case {
      'name': String _,
      'age': num _,
    }) {
  print('The name is a string');
}

```

注意：此处不能用

```dart
case {
    'name': String,
    'age': num,
  }:
```

匹配，因此这里的 `String` 和 `num`， 表示该属性的值为 `String` 和 `num` 类本身，测试如下：

```dart
void main() {
  Map<String, Object> map = {
    'name': String,
    'age': num,
  };

  // OK
  if (map case {'name': String, 'age': num}) {
    print('Name: $map["name"]');
    print('Age: $map["age"]');
  }
}


```





## Record 

`(subpattern1, subpattern2)`

Record patterns require that the pattern **match the entire record**. To destructure a record with *named* fields using a pattern, include the field names in the pattern

```dart
var (myString: foo, myNumber: bar) = (myString: 'string', myNumber: 1);
```

可以省略 getter 名称，并从字段子模式中的变量模式或标识符模式推断出来。这些模式对都是等效的

```dart
// Record pattern with variable subpatterns:
var (untyped: untyped, typed: int typed) = record;
var (:untyped, :int typed) = record;

switch (record) {
  case (untyped: var untyped, typed: int typed): // ...
  case (:var untyped, :int typed): // ...
}

// Record pattern with null-check and null-assert subpatterns:
switch (record) {
  case (checked: var checked?, asserted: var asserted!): // ...
  case (:var checked?, :var asserted!): // ...
}

// Record pattern with cast subpattern:
var (untyped: untyped as int, typed: typed as String) = record;
var (:untyped as int, :typed as String) = record;
```

## Object 

`SomeClass(x: subpattern1, y: subpattern2)`

Object patterns **don't require the pattern to match the entire object**. If an object has extra fields that the pattern doesn't destructure, it can still match.

```dart
switch (shape) {
  // Matches if shape is of type Rect, and then against the properties of Rect.
  case Rect(width: var w, height: var h): // ...
}


// Binds new variables x and y to the values of Point's x and y properties.
var Point(:x, :y) = Point(1, 2);


class Axis {
  int x;
  int y;
  int z;
  Axis(this.x, this.y, this.z);
}

void main() {
  var Point(:x, :y) = Axis(1, 2, 3);
  print('${x} ${y}'); // 1 2
}

```

## Wildcard

在需要子模式的地方，它作为占位符很有用，以便解构以后的位置值

```dart
var list = [1, 2, 3];
var [_, two, _] = list;
```

当您想**要测试值的类型但不将该值绑定到名称时**，带有类型注释的通配符名称非常有用

```dart
switch (record) {
  case (int _, String _):
    print('First field is int and second is String.');
}
```

# Functions

Dart is a true object-oriented language, so **even functions are objects and have a type, [Function.](https://api.dart.cn/stable/dart-core/Function-class.html) **

### Named parameters

`{param1, param2, …}`

命名参数是可选的，除非它们被明确标记为 `required` 

```dart
// address 类型为 String? 因为它可以为 null
void foo({ required num age, String? address }) {}

foo(age: 30);
foo(age: 30, address: 'shanghai');
```



```dart
// default value
void enableFlags({bool bold = false, bool hidden = false}) {...}
// bold will be true; hidden will be false.
enableFlags(bold: true);

// 标记为 required 的参数仍然可以为空：
const Scrollbar({super.key, required Widget? child});

```

You *might want to place positional arguments first*, but Dart doesn't require it. Dart **allows named arguments to be placed anywhere** in the argument list *when it suits your API*

```dart
void foo(String name, {required num age}) {}

// both OK
foo('jack', age: 25);
foo(age: 25, 'jack');
```

### Positiontal Parameters



### Optional positional parameters

将一组函数参数包装在 `[]` 中将它们标记为可选位置参数。如果您不提供默认值，则它们的类型必须可为空，因为它们的默认值将为 `null` 

```dart
String say(String from, String msg, [String? device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}

assert(say('Bob', 'Howdy') == 'Bob says Howdy');

assert(say('Bob', 'Howdy', 'smoke signal') ==
    'Bob says Howdy with a smoke signal');


// With default value
String say(String from, String msg, [String device = 'carrier pigeon']) {
  var result = '$from says $msg with a $device';
  return result;
}

assert(say('Bob', 'Howdy') == 'Bob says Howdy with a carrier pigeon');
```





Dart 语法要求**位置参数必须在命名参数之前**。这是因为位置参数的调用是基于参数的位置的，如果允许在命名参数之后出现位置参数，编译器将难以正确解析和匹配参数

```dart
// 错误的样例
void foo({required num age}, String name) {}
// 调用时 编译器可能会混淆，因为它无法轻易区分哪个值对应哪个参数。这就是为什么位置参数必须先于命名参数
foo(age: 30, "John");
```

A function can have any number of *required positional* parameters. These can be followed either by *named* parameters or by *optional positional* parameters (but not both).

函数可以具有任意数量的必选位置参数。这些参数后面可以跟有命名参数或可选的位置参数（但不能同时跟有两者）。

即：**可选位置参数**（optional positional parameters）和 **命名参数**（named parameters）不能同时出现在同一个函数的参数列表中

```dart
// ERROR
void foo(String name, [String? company = 'hh'], { required num age, String? address }) {}

// OK
void foo(String name, [String? company = 'hh']) {}
void foo(String name, { required num age }) {}
```







## The main() function

每个应用程序都必须有一个顶级 `main()` 函数，作为应用程序的入口点。 `main()` 函数返回 `void` 并**具有可选的 `List<String>` 参数作为参数。**

```dart
// Run the app like this: dart run args.dart 1 test
void main(List<String> arguments) {
  print(arguments);

  assert(arguments.length == 2);
  assert(int.parse(arguments[0]) == 1);
  assert(arguments[1] == 'test');
}
```



## Functions as first-class objects

> “一等公民” (First-Class Citizens) 是编程语言理论中的一个术语，最早可以追溯到计算机科学家 Christopher Strachey 在 1960 年代的研究工作。他提出了“first-class object”或“first-class citizen”的概念，用来描述编程语言中对某种实体（如函数、对象、数字等）所赋予的权利或能力。

在编程语言中，如果某种实体是“一等公民”，它就具备以下权利：

1. **赋值**：可以赋值给变量或存储在数据结构中。
2. **传递**：可以作为参数传递给其他函数或方法。
3. **返回**：可以作为函数或方法的返回值。
4. **动态创建**：可以在程序运行时动态创建。

在编程语言中，某种实体如果是“一等公民”，它在语言中享有最大的自由和灵活性，可以像其他基本数据类型（如整数或字符串）一样被操作。这个比喻形象地表达了在编程语言中对某种实体的高度自由和灵活性，而这种自由使得编程语言更加灵活和强大。



## Generators 

当您需要延迟生成值序列时，请考虑使用生成器函数。 Dart 内置支持两种生成器函数：

- **Synchronous** generator: Returns an [`Iterable`](https://api.dart.cn/stable/dart-core/Iterable-class.html) object.  
  - 同步生成器：返回一个`Iterable`对象。
- **Asynchronous** generator: Returns a [`Stream`](https://api.dart.cn/stable/dart-async/Stream-class.html) object.
  - 异步生成器：返回一个`Stream`对象。

要实现同步生成器函数，请将函数体标记为 `sync*` ，并使用 `yield` 语句传递值：

```dart
Iterable<int> naturalsTo(int n) sync* {
  int k = 0;
  while (k < n) yield k++;
}
```

要实现异步生成器函数，请将函数体标记为 `async*` ，并使用 `yield` 语句传递值：

```dart
Stream<int> asynchronousNaturalsTo(int n) async* {
  int k = 0;
  while (k < n) yield k++;
}
```

如果您的生成器是递归的，您可以使用 `yield*` 提高其性能：

```dart
Iterable<int> naturalsDownFrom(int n) sync* {
  if (n > 0) {
    yield n;
    yield* naturalsDownFrom(n - 1);
  }
}

// 如何获取值 

// 1. main 为 async，使用 toList
void main(List<String> args) async {
	List<int> res = await naturalsDownFrom(10).toList();
	print(res);
}

// 2
void main(List<String> args) async {
  Stream<int> res = naturalsDownFrom(10);
  await res.listen((v) {
    print(v);
  });
}

// 3
void main(List<String> args) async {
  Stream<int> res = naturalsDownFrom(10);
  await res.forEach((v) {
    print(v);
  });
}

// 4
void main(List<String> args) async {
  Stream<int> res = naturalsDownFrom(10);
  await for (int v in res) {
    print(v);
  }
}
```





## External functions

外部函数是指其**函数体与其声明分开实现的函数**。在函数声明之前包含 `external` 关键字，如下所示：

```dart
external void someFunc(int i);
```

外部函数的**实现可以来自另一个 Dart 库，或者更常见的是来自另一种语言**。在互操作上下文中，`external` 引入外部函数或值的类型信息，使它们可以在 Dart 中使用。实现和使用在很大程度上是特定于平台的，因此请查看 C 或 JavaScript 等互操作文档以了解更多信息。

外部函数可以是顶级函数、实例方法、getter 或 setter 或非重定向构造函数。实例变量也可以是 `external` ，这相当于外部 getter 和（如果变量不是 `final` ）外部 setter。







# Loops

## For loops

Dart 的 `for` 循环内部的闭包捕获索引的值。这避免了 JavaScript 中常见的陷阱。

```dart
var callbacks = [];
for (var i = 0; i < 2; i++) {
  callbacks.add(() => print(i));
}

// output: 0 1
for (final c in callbacks) {
  c();
}
```

有时，在迭代 `Iterable` 类型（例如 `List` 或 `Set` ）时，您可能*不需要知道当前迭代计数器*。在这种情况下，请使用 `for-in` 循环来获得更简洁的代码：

```dart
for (final candidate in candidates) {
  candidate.interview();
}
```

要处理从 iterable 获取的值，您还可以在 `for-in` 循环中使用模式：

```dart
for (final Candidate(:name, :yearsExperience) in candidates) {
  print('$name has $yearsExperience of experience.');
}
```

## While and do-while

## Break and continue





# Branches

- `if` statements and elements
- `if-case` statements and elements
- `switch` statements and expressions

## If-case

Dart `if` statements support `case` clauses followed by a [pattern](https://dart.cn/language/patterns)

```dart
if (pair case [int x, int y]) return Point(x, y);
```

## Switch statements 

```dart
switch (command) {
  case 'OPEN':
    executeOpen();
    continue newCase; // Continues executing at the newCase label.

  case 'DENIED': // Empty case falls through.
  case 'CLOSED':
    executeClosed(); // Runs for both DENIED and CLOSED,

  newCase:
  case 'PENDING':
    executeNowClosed(); // Runs for both OPEN and PENDING.
}
```

### Switch expressions

A `switch` *expression* **produces a value** based on the expression body of whichever case matches. You can **use a switch expression wherever Dart allows expressions**, *except* at the start of an expression statement.

```dart
var x = switch (y) { ... };

print(switch (x) { ... });

return switch (x) { ... };
```

```dart
token = switch (charCode) {
  slash || star || plus || minus => operator(charCode),
  comma || semicolon => punctuation(charCode),
  >= digit0 && <= digit9 => number(),
  // DEFAULT
  _ => throw FormatException('Invalid')
};
```

The syntax of a `switch` expression differs from `switch` statement syntax:

- Cases *do not* start with the `case` keyword.
- A case body is a single expression instead of a series of statements.
- Each case must have a body; **there is no implicit fallthrough for empty cases**.
- Case patterns are separated from their bodies using `=>` instead of `:`.
- Cases are separated by `,` (and an optional trailing `,` is allowed).
- Default cases can *only* use `_`, instead of allowing both `default` and `_`.

> Switch expressions require a [language version](https://dart.cn/guides/language/evolution#language-versioning) of at least 3.0.

## Guard clause

要在 `case` 子句后设置可选的保护子句，请使用关键字 `when` 。保护子句可以跟在 `if case` 以及 `switch` 语句和表达式之后。

When the guard clause **evaluates to false**, execution **proceeds to the next case rather than exiting the entire switch**.

```dart
// Switch statement:
switch (something) {
  case somePattern when some || boolean || expression:
    //             ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Guard clause.
    body;
}

// Switch expression:
var value = switch (something) {
  somePattern when some || boolean || expression => body,
  //               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Guard clause.
}

// If-case statement:
if (something case somePattern when some || boolean || expression) {
  //                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ Guard clause.
  body;
}
```

### 



# Error handling

## Catch

```dart
try {
  breedMoreLlamas();
} on OutOfLlamasException {
  buyMoreLlamas();
  // 需要异常对象时使用 catch
} on Exception catch (e) {
  // Anything else that is an exception
  print('Unknown exception: $e');
} catch (e) {
  // No specified type, handles all
  print('Something really unknown: $e');
}

// 您可以为 catch() 指定一个或两个参数。第一个参数是抛出的异常，第二个参数是堆栈跟踪（StackTrace 对象）
try {
  // ···
} on Exception catch (e) {
  print('Exception details:\n $e');
} catch (e, s) {
  print('Exception details:\n $e');
  print('Stack trace:\n $s');
}
```

要部分处理异常，同时允许其传播，请使用 `rethrow` 关键字。

```dart
void misbehave() {
  try {
    dynamic foo = true;
    print(foo++); // Runtime error
  } catch (e) {
    print('misbehave() partially handled ${e.runtimeType}.');
    rethrow; // Allow callers to see the exception.
  }
}
```

## Assert

`assert` 的第一个参数可以是解析为布尔值的任何表达式。如果表达式的值为 true，则断言成功并继续执行。如果为 false，则断言失败并引发异常（`AssertionError`）。

要将消息附加到断言，请将字符串添加为 `assert` 的第二个参数（可以选择使用尾随逗号）：

```dart
assert(urlString.startsWith('https'),
    'URL ($urlString) should start with "https".');
```

断言到底什么时候起作用？这取决于您使用的工具和框架：

- Flutter enables assertions in [debug mode. ](https://docs.flutter.cn/testing/debugging#debug-mode-assertions) 
  - Flutter 在调试模式下启用断言。
- Development-only tools such as [`webdev serve`](https://dart.cn/tools/webdev#serve) typically enable assertions by default.
  - `webdev serve` 等仅供开发的工具通常默认启用断言。
- Some tools, such as [`dart run`](https://dart.cn/tools/dart-run) and [`dart compile js`](https://dart.cn/tools/dart-compile#js) support assertions through a command-line flag: `--enable-asserts`.
  - 某些工具，例如 `dart run` 和 `dart compile js` 支持通过命令行标志进行断言： `--enable-asserts` 。

In production code, assertions are ignored, and the arguments to `assert` aren't evaluated.



