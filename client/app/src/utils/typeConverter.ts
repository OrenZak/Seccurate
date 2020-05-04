function fromHumanValue(value: any): any {
  if (!isNaN(value)) {
      return Number(value);
  }

  if(value === 'true') return true;
  if(value === 'false') return false;

  if (value[0] === '"' && value[value.length - 1] === '"') {
      return value.substring(1, value.length - 1);
  }

  return value;
}

function toHumanValue(value: any): any {
  if (typeof value === "string") {
    const toNum = Number(value);
    return isNaN(toNum) ? value : `"${value}"`;
  }
  return value;
}

function createTargetWithValueModifier(target: Target, modifier: (value: any) => any): Target {
  let typedTarget = JSON.parse(JSON.stringify(target));
  if (typedTarget.loginInfo?.authenticationType) {
      let newFields:{ [key: string]: any } = {};
      for (const [name, value] of Object.entries(typedTarget.loginInfo.form)) {
          newFields[name] = modifier(value);
      }
      typedTarget.loginInfo.form = newFields;
  }
  return typedTarget;
}

export function createTypedTarget(target: Target): Target {
  return createTargetWithValueModifier(target, fromHumanValue);
}

export function createHumanTarget(target: Target): Target {
  const newtarget = createTargetWithValueModifier(target, toHumanValue);
  console.log("the human target: ", newtarget.loginInfo?.form);
  return newtarget;
}