<script>
    export let text = "";
    export let href = "";
</script>
  
<li>
    <a href={href} class="hover:cursor-pointer">{text}</a>
    <ul class="block pl-10 text-white"><slot></slot></ul>
</li>

<style>
    a {
        text-decoration: underline;
        text-decoration-color: aqua;
    }
    
    ul {
        list-style-type: disc;
    }
</style>