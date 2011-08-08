/*
Copyright (c) 2005 Tim Taylor Consulting <http://tool-man.org/>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.
*/

var ESCAPE = 27
var ENTER = 13
var TAB = 9

var coordinates = ToolMan.coordinates()
var dragsort = ToolMan.dragsort()

function setHandle(item) {
    item.toolManDragGroup.setHandle(findHandle(item))
}

function findHandle(item) {
    var children = item.getElementsByTagName("div")
    for (var i = 0; i < children.length; i++) {
        var child = children[i]

        if (child.getAttribute("class") == null) continue

        if (child.getAttribute("class").indexOf("handle") >= 0)
            return child
    }
    return item
}

function join(name, isDoubleClick) {
    var view = document.getElementById(name + "View")
    view.editor = document.getElementById(name + "Edit")

    var showEditor = function(event) {
        event = fixEvent(event)

        var view = this
        var editor = view.editor

        var children = view.parentNode.getElementsByTagName("input")
        for (var i = 0; i < children.length; i++) {
            var child = children[i];;
            if (child.getAttribute("type") == "checkbox")
            {
                if(child.checked== true)
                {
                    child.checked = false;
                }
                else
                {
                    child.checked = true;
                }
                 changeCheck(child);
            }
        }


        if (!editor) return true

        if (editor.currentView != null) {
            editor.blur()
        }
        editor.currentView = view

        var topLeft = coordinates.topLeftOffset(view,true)
        topLeft.reposition(editor)
        if (editor.nodeName == 'TEXTAREA') {
            editor.style['width'] = parseInt(view.parentNode.offsetWidth) + "px"
            editor.style['height'] = parseInt(view.parentNode.offsetHeight+5) + "px"
        }
        editor.value = view.innerHTML
        editor.style['visibility'] = 'visible'
        view.style['visibility'] = 'hidden'
        editor.focus()
        return false
    }

    if (isDoubleClick) {
        view.ondblclick = showEditor
    } else {
        view.onclick = showEditor
    }

    view.editor.onblur = function(event) {
        event = fixEvent(event)

        var editor = event.target
        var view = editor.currentView

        if (!editor.abandonChanges) view.innerHTML = editor.value
        editor.abandonChanges = false
        editor.style['visibility'] = 'hidden'
        editor.value = '' // fixes firefox 1.0 bug
        view.style['visibility'] = 'visible'
        editor.currentView = null

        return true
    }

    view.editor.onkeydown = function(event) {
        event = fixEvent(event)

        var editor = event.target
        if (event.keyCode == TAB) {
            editor.blur()
            return false
        }
    }

    view.editor.onkeyup = function(event) {
        event = fixEvent(event)

        var editor = event.target
        if (event.keyCode == ESCAPE) {
            editor.abandonChanges = true
            editor.blur()
            return false
        } else if (event.keyCode == TAB) {
            return false
        } else {
            return true
        }
    }

    // TODO: this method is duplicated elsewhere
    function fixEvent(event) {
        if (!event) event = window.event
        if (event.target) {
            if (event.target.nodeType == 3) event.target = event.target.parentNode
        } else if (event.srcElement) {
            event.target = event.srcElement
        }

        return event
    }
}
