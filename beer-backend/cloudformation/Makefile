STACK_NAME := dev-stack-2
TEMPLATE_BODY := template.yml

create:
	aws cloudformation create-stack \
	--stack-name $(STACK_NAME) \
	--template-body file://$(TEMPLATE_BODY) \
	--capabilities CAPABILITY_AUTO_EXPAND

update:
	aws cloudformation update-stack \
	--stack-name $(STACK_NAME) \
	--template-body file://$(TEMPLATE_BODY) \
	--capabilities CAPABILITY_AUTO_EXPAND