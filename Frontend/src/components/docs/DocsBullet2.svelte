<script>
    export let text = "";
    export let href = "";
</script>
  
<li>
    <a href={href} class="hover:cursor-pointer">{text}</a>
    <ul class="block pl-10 text-black"><slot></slot></ul>
</li>

<style>
    a {
        text-decoration: underline;
        text-decoration-color: #00ffea;
    }
    
    ul {
        list-style-type: disc;
    }
</style>