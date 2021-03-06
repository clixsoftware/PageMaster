// Copyright (c) 2018, libracore and contributors
// For license information, please see license.txt

frappe.ui.form.on('PageMaster Page', {
	onload: function(frm) {
			getBody(frm);
			getNavbar(frm);
			getFooter(frm);
			getGoogle(frm);
			getHeader(frm);
	},
	refresh: function(frm) {
		frm.add_custom_button(__("Get Default Page Parameter"),
			function() {
				getBody(frm);
				getNavbar(frm);
				getFooter(frm);
				getGoogle(frm);
				getHeader(frm);
		});
	}
});

function getBody(frm) {
	frappe.call({
		"method": "frappe.client.get",
		"args": {
			"doctype": "Body Settings"
		},
		"callback": function(response) {
			let content = response.message;
			if (content.bg_select == "Image"){
				frm.set_value('bg_img', content.bg_img);
				frm.set_value('bg_color', '');
			}
			if (content.bg_select == "Color"){
				frm.set_value('bg_img', '');
				frm.set_value('bg_color', content.bg_color);
			}
		}
	});
}

function getNavbar(frm) {
	frappe.call({
		"method": "frappe.client.get",
		"args": {
			"doctype": "Navbar"
		},
		"callback": function(response) {
			let content = response.message;
			frm.set_value('nav_bg_color', content.nav_bg_color);
			frm.set_value('nav_txt_color', content.nav_txt_color);
		}
	});
	if (frm.doc.navlinks.length > 0) {
		cur_frm.get_field('navlinks').grid.grid_rows.forEach(function(row) {
			row.remove();	 
		});
		cur_frm.get_field('navlinks').grid.grid_rows[0].remove();
		cur_frm.refresh_field('navlinks');
	}
	frappe.call({
		"method": "frappe.client.get_list",
		"args": {
			"doctype": "Navbar Item",
			"filters": {"parent": "Navbar"},
			"fields": ["title", "link"],
			"order_by": "idx ASC"
		},
		"callback": function(response) {
			let content = response.message;
			for (var i = 0; i < content.length; i++) {
				var child = cur_frm.add_child('navlinks');
				frappe.model.set_value(child.doctype, child.name, "title", content[i].title);
				frappe.model.set_value(child.doctype, child.name, "link", content[i].link);
				cur_frm.refresh_field('navlinks');
			}
		}
	});	
}

function getFooter(frm) {
	frappe.call({
		"method": "frappe.client.get",
		"args": {
			"doctype": "PageMaster Footer"
		},
		"callback": function(response) {
			let content = response.message;
			frm.set_value('footer_bg_color', content.footer_bg_color);
			frm.set_value('footer_txt_color', content.footer_txt_color);
			frm.set_value('footer_txt', content.txt);
			frm.set_value('footer_link_title', content.link_title);
			frm.set_value('footer_link', content.link);
		}
	});
}

function getGoogle(frm) {
	frappe.call({
		"method": "frappe.client.get",
		"args": {
			"doctype": "Google Analytics"
		},
		"callback": function(response) {
			let content = response.message;
			if (content.enable == 1) {
				frm.set_value('google_id', content.id);
				frm.set_value('google_enable', content.enable);
			} else {
				frm.set_value('google_id', '');
				frm.set_value('google_enable', content.enable);
			}
		}
	});
}

function getHeader(frm) {
	frappe.call({
		"method": "frappe.client.get",
		"args": {
			"doctype": "Head Settings"
		},
		"callback": function(response) {
			let content = response.message;
			frm.set_value('head_title', content.head_title);
			frm.set_value('meta_keywords', content.meta_keywords);
			frm.set_value('meta_description', content.meta_description);
			frm.set_value('meta_page_topic', content.meta_page_topic);
			frm.set_value('meta_robots', content.meta_robots);
			frm.set_value('meta_revisit_after', content.meta_revisit_after);
			frm.set_value('head_favicon', content.head_favicon);
		}
	});	
}