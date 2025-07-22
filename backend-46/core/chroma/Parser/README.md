## About Chroma
Chroma is a powerful vector-based database. It provides collections and official [instruments](https://docs.trychroma.com/docs/collections/manage-collections) to work with them directly in Python or Typescript. Chroma stores embeddings of texts to perform searching content-close information fast and efficient. But it has some peculiarities that makes its usage and deployment hard. We implemented fully-functional collections with custom domain-specific language and deployed playground for it.

### Collections 📚
Chroma Collections are like folders that store *embeddings*, which are special representations of data (like text or images) turned into numerical form so you can search, filter, and analyse them smartly.

### Why we developed a language?
Chroma provides officially only packages for Python and Typescript. So, to write in Chroma, user needs to write directly in Python, which was not suitable for our online playground app and might be inconvenient for many other purposes. We wanted to provide simple environment without a need of any installation and set up, so we did it in Python backend and gave understandable interface and useful tips to users. 

### Possible commands
You can work with files inside the collection with all possible Chroma instruments. So you can:
- Add files with given name (content) and optional metadata;
- Get the concrete file content by its ID;
- Update the file content and metadata;
- Search for the nearest files with respect to their content;
- Delete the file;
- Drop the whole collection;
You should use a semicolon `;` at the end of every command
##### ADD
`ADD content of your file here metadata:topic=history,author=Alex;`
1. You **must** specify the command by typing `ADD`
2. You **must** write any content (text) for the file. Embedding will be produced automatically
3. You **may** specify *metadata* for your file. It could be useful while searching. To do so, write `metadata` and then some key-value pairs `key=value` separated by a comma `,`
##### GET
`GET -> doc_123456789;`
1. You **must** specify the command by typing `GET`
2. You **must** use `->` to indicate the following number
3. You **must** specify the file ID as `doc_sequenceOfNumbers`
##### UPDATE
`UPDATE -> doc_123456789 new content of your file here metadata:NewTopic=geography,NewAuthor=Jack;`
1. You **must** specify the command by typing `UPDATE`
2. You **must** use `->` to indicate the following number
3. You **must** specify the file ID as `doc_sequenceOfNumbers`
4. You **must** write any content (text) for the file. Embedding will be produced automatically
5. You **may** specify *metadata* for your file. It could be useful while searching. To do so, write `metadata` and then some key-value pairs `key=value` separated by a comma `,`
##### SEARCH
`SEARCH -> 5 your search string metadata:key1=value1,key2=value2;`
1. You **must** specify the command by typing `SEARCH`
2. You **must** use `->` to indicate the following number
3. You **must** specify the number of expected files
4. You **must** write you search string as a plane text. Chroma will return to you files with the closest content
5. You **may** specify expected *metadata* for the files. To do so, write `metadata` and then some key-value pairs `key=value` separated by a comma `,`
##### DELETE
`DELETE -> doc_123456789;`
1. You **must** specify the command by typing `DELETE`
2. You **must** use `->` to indicate the following number
3. You **must** specify the file ID as `doc_sequenceOfNumbers`
##### DROP
`DROP;`
1. You **must** specify the command by typing `DROP`  

### Which problems we faced? And how we solved them!
##### LLMs
Chroma uses Large Language Models (LLMs) to produce embeddings for files content. We are using default built-in function, but it is possible to specify any other embedding model or even provide embeddings by yourself as an add or update method argument.

The real problem is that such tools take a huge amount of time to install. So, what we did:
1. Separated Chroma to a different service (container) for easy excluding it from the whole project and make a possibility to test something without long wait
2. Increased the maximum time of SSH connection and command execution for GitHub Actions to 1 hour
3. Used docker built-in caching to avoid re-installing of packages.
   
##### Big differences from conventional databases
Firstly, we did a big work to create simple and understandable documentation. Secondly, we tried to provide hard Chroma functional in a way with simple one-line commands
##### Lack of language
We introduced our own language to manage Chroma collections easily and describe it. We wrote our parser in Haskell language via megaparsec for stability and strong typing. 
