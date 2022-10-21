/*
Copyright 2021 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { TemplateView } from "../../general/TemplateView";
import {MemberListView} from "./MemberListView";
import {ListView} from "../../general/ListView";
import {MemberSearchView} from "./MemberSearchView";

class FilterField extends TemplateView {
    render(t, options) {
        const clear = () => {
            filterInput.value = "";
            filterInput.blur();
            clearButton.blur();
            options.clear();
        };
        const filterInput = t.input({
            type: "text",
            placeholder: options?.label,
            "aria-label": options?.label,
            autocomplete: options?.autocomplete,
            enterkeyhint: 'search',
            name: options?.name,
            onInput: event => options.set(event.target.value),
            onKeydown: event => {
                if (event.key === "Escape" || event.key === "Esc") {
                    clear();
                }
            },
            onFocus: () => filterInput.select()
        });
        const clearButton = t.button({
            onClick: clear,
            title: options.i18n`Clear`,
            "aria-label": options.i18n`Clear`
        });
        return t.div({className: "FilterField"}, [filterInput, clearButton]);
    }
}

export class EnhancedMemberListView extends TemplateView {
    render(t, vm) {
        const searchList = t.view(new ListView(
            {
                className: "MemberList",
                list: vm.tileViewModels,
            },
            tileVM => new MemberSearchView(tileVM)
        ));
        return t.div({className: "EnhancedMemberListView"},
            [
                t.view(new MemberListView(vm)),
                t.div({className: "MemberAdd"},
                    [
                        t.view(new FilterField({
                            i18n: vm.i18n,
                            label: vm.i18n`Filter members...`,
                            name: "member-filter",
                            autocomplete: true,
                            set: query => {
                                // scroll up if we just started filtering
                                if (vm.setFilter(query)) {
                                    searchList.scrollTop = 0;
                                }
                            },
                            clear: () => vm.clearFilter()
                        })),
                    ]
                ),
                searchList
            ]);
    }
}
