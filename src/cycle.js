export const decycle =
  (object, replacer) => {
    var objects = new WeakMap()

        return (function derez(value, path) {

            var old_path;   
            var nu;        

            if (replacer !== undefined) {
                value = replacer(value);
            }

            if (
                typeof value === "object"
                && value !== null
                && !(value instanceof Boolean)
                && !(value instanceof Date)
                && !(value instanceof Number)
                && !(value instanceof RegExp)
                && !(value instanceof String)
            ) {


                old_path = objects.get(value);
                if (old_path !== undefined) {
                    return {$ref: old_path};
                }


                objects.set(value, path);


                if (Array.isArray(value)) {
                    nu = [];
                    value.forEach(function (element, i) {
                        nu[i] = derez(element, path + "[" + i + "]");
                    });
                } else {


                    nu = {};
                    Object.keys(value).forEach(function (name) {
                        nu[name] = derez(
                            value[name],
                            path + "[" + JSON.stringify(name) + "]"
                        );
                    });
                }
                return nu;
            }
            return value;
        }(object, "$"));
    };

export const retrocycle =
  ($) => {
        var px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;

        (function rez(value) {

            if (value && typeof value === "object") {
                if (Array.isArray(value)) {
                    value.forEach(function (element, i) {
                        if (typeof element === "object" && element !== null) {
                            var path = element.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[i] = eval(path);
                            } else {
                                rez(element);
                            }
                        }
                    });
                } else {
                    Object.keys(value).forEach(function (name) {
                        var item = value[name];
                        if (typeof item === "object" && item !== null) {
                            var path = item.$ref;
                            if (typeof path === "string" && px.test(path)) {
                                value[name] = eval(path);
                            } else {
                                rez(item);
                            }
                        }
                    });
                }
            }
        }($));
        return $;
}
