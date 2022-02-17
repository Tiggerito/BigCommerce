/*
    Web Site Advantage: RallyOn Base [v1.0] 
    Utility functions shared by each tag. Add before all other scripts
    https://bigcommerce.websiteadvantage.com.au/tag-rocket/
    Copyright (C) 2022 Web Site Advantage
*/
TagRocket=TagRocket||{};
!function(d,T){
    T.addTag=function(name, attributes, onLoad) {
        var e=d.createElement(name);

        if(attributes) {
            if(attributes.id&&d.getElementById(attributes.id))return; // don;t add if id is already used
        }

        for(var a in attributes){
            e[a]=attributes[a]
        }

        if(onLoad) {
            e.onload=e.onreadystatechange=function(){
                var readyState=e.readyState;
                if(!readyState||readyState=='loaded'||readyState=='complete'){
                    if(onLoad)onLoad();
                    onLoad=null; // only run once
                }
            }
        }

        d.getElementsByTagName('head')[0].appendChild(e);

        return e;
    };

    T.addScriptTag=function(src, attributes, onLoad) {
        attributes=attributes||{};
        attributes.src=src;
        attributes.async=true;

        T.addTag('script', attributes, onLoad);
    };
}(document,TagRocket);
