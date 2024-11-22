<script>
    export let text = "";
    export let href = "";
</script>
  
<li class="list-item">
    <a href={href} class="hover:cursor-pointer">{text}</a>
    <ul class="block list-disc pl-10 text-white"><slot></slot></ul>
</li>