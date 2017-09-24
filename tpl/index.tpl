<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>A5 landscape</title>
  <!-- Normalize or reset CSS with your favorite library -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/paper-css/0.2.3/paper.css">
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/mermaid/6.0.0/mermaid.css">
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/6.0.0/mermaid.js"></script>

  <link rel="stylesheet" href="../assets/theme.css">
  <style type="text/css">
  .sheet.padding-5mm {
    padding: 5mm;
  }

  pre div.mermaid{
    font-family: Arial
  }

  </style>

  <style>@page { size: A5 portrait }</style>
</head>
<body class="A5 portrait">

  <!-- CARDS -->
  {{#each Cards}}
  <section class="sheet padding-5mm card {{tag}}">
    <div class="title">
      <h1>Ficheiro de {{subsubject}}</h1>
      <div class="num">{{number}}</div>
    </div>
    <article>
      {{{html}}}
    </article>
  </section>
  {{/each}}


  <script>
    mermaid.initialize({startOnLoad: true});
    setTimeout(()=>{
      document.querySelectorAll('th:empty').forEach(e => e.remove())
    },1)
  
  </script>
</body>

</html>